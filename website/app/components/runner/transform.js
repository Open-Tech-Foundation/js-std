import scan from './scan.js';

/**
 * Rewrites a documentation example into a body the runner can execute.
 *
 * The examples are written to be read, not run: they carry `import` lines that
 * name a package the worker has already bound, and they record results in
 * `//=>` comments rather than assertions. Two rewrites bridge that gap —
 * imports of the library are commented out, and every annotated statement is
 * handed to `__probe`, which reports the value back for display next to the
 * line it came from.
 *
 * Every edit preserves the line count and the columns before it, so a runtime
 * error's line number still points at the line the reader is looking at.
 */

/** Statement keywords that rule out treating a statement as an expression. */
const STATEMENT_KEYWORDS = new Set([
  'if',
  'for',
  'while',
  'do',
  'switch',
  'try',
  'catch',
  'finally',
  'return',
  'throw',
  'break',
  'continue',
  'function',
  'class',
  'export',
  'import',
  'const',
  'let',
  'var',
  'else',
  'case',
  'default',
  'with',
  'debugger',
]);

/** A trailing operator means the statement continues on the next line. */
const CONTINUES_AFTER =
  /[+\-*/%,=<>&|?:.([{]$|=>$|\b(typeof|instanceof|in|of|new|await|return)$/;

/** A leading operator means this line continues the previous one. */
const CONTINUES_BEFORE =
  /^\s*([.)\]}]|\?\.|&&|\|\||\?\?|[+\-*/%,:=<>|&]|\bin\b|\binstanceof\b)/;

const DECLARATION = /^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/;

/**
 * Groups scanned lines into top-level statements.
 *
 * A statement ends on a line that closes every bracket it opened, unless the
 * text leans across the break — `const r = arr` followed by `.map(…)` is one
 * statement whose first line happens to sit at depth zero. Checking the
 * operators on both sides of the newline is how JavaScript's own automatic
 * semicolon insertion decides, minus the cases the examples never contain.
 */
function statements(lines) {
  const out = [];
  let start = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const code = line.code.trim();
    if (code === '' && start === -1) continue;
    if (start === -1) start = i;
    if (line.depth > 0) continue;
    if (code !== '' && CONTINUES_AFTER.test(code.replace(/;$/, ''))) continue;

    const next = lines.slice(i + 1).find((l) => l.code.trim() !== '');
    if (next && CONTINUES_BEFORE.test(next.code)) continue;
    if (code === '') continue;

    out.push({ start, end: i });
    start = -1;
  }

  if (start !== -1) out.push({ start, end: lines.length - 1 });
  return out;
}

/** The `//=>` annotation on a statement's last line, if it carries one. */
function annotation(line) {
  if (line.commentAt === -1) return null;
  const comment = line.text.slice(line.commentAt);
  const m = /^\/\/\s*=>\s*(.*)$/.exec(comment);
  return m ? m[1].trim() : null;
}

/** The statement's code with comments and trailing `;` removed. */
function bareCode(lines, stmt) {
  const parts = [];
  for (let i = stmt.start; i <= stmt.end; i++) parts.push(lines[i].code);
  return parts.join('\n').trim().replace(/;+$/, '').trim();
}

/**
 * Prepares `source` for execution.
 *
 * Returns the rewritten `code` plus a `probes` table describing what each
 * `__probe` call is reporting on — the line to anchor the result to, the
 * expression as written, and the result the documentation claims. The worker
 * never parses the source again; everything it needs to render a result is
 * here.
 *
 * @param {string} source The example as it appears in the docs.
 * @param {{ probeAll?: boolean }} [options] `probeAll` reports every top-level
 *   expression, annotated or not — what a REPL shows, and too noisy for a doc
 *   page.
 */
export default function transform(source, options = {}) {
  const lines = scan(source);
  const text = lines.map((l) => l.text);
  const probes = [];

  for (const stmt of statements(lines)) {
    const first = lines[stmt.start];
    const last = lines[stmt.end];
    const head = first.code.trim();
    const expected = annotation(last);

    // The library's own names are already bound in the runner's scope, so the
    // import is noise; a third-party one is left in place to fail loudly.
    if (/^import\b/.test(head)) {
      // The specifier lives in a string, which the scanner blanks, so the
      // package name has to be matched against the untouched text.
      const raw = text.slice(stmt.start, stmt.end + 1).join('\n');
      if (/['"]@opentf\/std['"]/.test(raw)) {
        for (let i = stmt.start; i <= stmt.end; i++) {
          text[i] = `// ${text[i]}`;
        }
      }
      continue;
    }

    const bare = bareCode(lines, stmt);
    const keyword = /^[A-Za-z_$][\w$]*/.exec(head)?.[0];
    const declared = DECLARATION.exec(bare)?.[1];

    // Several statements sharing a line cannot be wrapped as one expression,
    // and a `;` survives in the blanked code view only when it is real.
    const compound = bare.includes(';');
    const isExpression =
      !compound && (!keyword || !STATEMENT_KEYWORDS.has(keyword));

    if (!isExpression && !declared) continue;
    if (expected === null && !options.probeAll) continue;

    const id = probes.length;
    probes.push({ id, line: stmt.end, expected, expr: bare });

    // The insertion point is before a trailing comment, so `//=> …` stays
    // visible at the end of the line exactly where the reader expects it.
    const cut = last.commentAt === -1 ? last.text.length : last.commentAt;
    const before = text[stmt.end].slice(0, cut).replace(/\s+$/, '');
    const after = text[stmt.end].slice(cut);

    if (declared) {
      // A declaration that relies on automatic semicolon insertion — one
      // ending in `.map(d => d.toString())` with no `;` — would swallow the
      // probe call as a continuation of its own expression.
      const semi = /;\s*$/.test(before) ? '' : ';';
      text[stmt.end] = `${before}${semi} __probe(${id}, ${declared}); ${after}`;
      continue;
    }

    const trimmed = before.replace(/;$/, '');
    text[stmt.start] = `__probe(${id}, (${text[stmt.start]}`;
    if (stmt.end === stmt.start) {
      const wrapped = `__probe(${id}, (${trimmed}`;
      text[stmt.end] = `${wrapped})); ${after}`;
    } else {
      text[stmt.end] = `${trimmed})); ${after}`;
    }
  }

  return { code: text.join('\n'), probes };
}
