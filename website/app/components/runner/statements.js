import scan from './scan.js';

/**
 * Groups scanned lines into the top-level statements of an example.
 *
 * Both things done to an example need the same reading of it: the runner wraps
 * annotated statements so their values are reported, and the Try it editor
 * wraps them in `console.log`. Splitting on `;` would miss the many examples
 * written without one, so the shape is worked out from bracket depth and the
 * operators on either side of a newline.
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
 * Reads `source` into lines and the statements over them.
 *
 * A statement ends on a line that closes every bracket it opened, unless the
 * text leans across the break — `const r = arr` followed by `.map(…)` is one
 * statement whose first line happens to sit at depth zero. Checking the
 * operators on both sides of the newline is how JavaScript's own automatic
 * semicolon insertion decides, minus the cases the examples never contain.
 */
export default function read(source) {
  const lines = scan(source);
  const found = [];
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

    found.push(describe(lines, start, i));
    start = -1;
  }

  if (start !== -1) found.push(describe(lines, start, lines.length - 1));
  return { lines, statements: found };
}

/** What a caller needs to know about one statement, worked out once. */
function describe(lines, start, end) {
  const parts = [];
  for (let i = start; i <= end; i++) parts.push(lines[i].code);
  const bare = parts.join('\n').trim().replace(/;+$/, '').trim();

  const keyword = /^[A-Za-z_$][\w$]*/.exec(bare)?.[0];

  // Several statements sharing a line cannot be wrapped as one expression. Only
  // a semicolon at depth zero separates them, and the statement's own
  // terminator is not one of those — `await mapAsync(xs, async (n) => { … })`
  // carries a semicolon inside the callback and is still a single expression.
  let semis = 0;
  for (let i = start; i <= end; i++) semis += lines[i].semis.length;
  const terminated = /;$/.test(parts.join('\n').trim());
  const compound = semis - (terminated ? 1 : 0) > 0;

  return {
    start,
    end,
    bare,
    expected: annotation(lines, end),
    declared: DECLARATION.exec(bare)?.[1] ?? null,
    isImport: /^import\b/.test(bare),
    isExpression: !compound && (!keyword || !STATEMENT_KEYWORDS.has(keyword)),
  };
}

/** The `//=>` annotation on a statement's last line, if it carries one. */
function annotation(lines, end) {
  const line = lines[end];
  if (line.commentAt !== -1) {
    const m = /^\/\/\s*=>\s*(.*)$/.exec(line.text.slice(line.commentAt));
    if (m) return m[1].trim();
  }

  // Multi-line expected values are usually written below an expression. The
  // first `//=>` line is enough to identify it as a result worth printing;
  // its following lines are prose for the reader, not executable code.
  const next = lines[end + 1];
  const m = next && /^\s*\/\/\s*=>\s*(.*)$/.exec(next.text);
  return m ? m[1].trim() : null;
}
