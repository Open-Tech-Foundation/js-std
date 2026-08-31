import read from './statements.js';

/**
 * Rewrites an example into a body the runner can execute.
 *
 * Two rewrites bridge the gap between an example written to be read and one
 * that can be run. An `import` of the library is commented out, because the
 * runner has already bound every export. And when `probe` is asked for, each
 * annotated statement is handed to `__probe`, which reports the value back so
 * it can be checked against the `//=>` beside it — that path is what the
 * example tests use; the editor prints through `console.log` instead.
 *
 * Every edit preserves the line count and the columns before it, so a runtime
 * error's line number still points at the line the reader is looking at.
 */
export default function transform(source, options = {}) {
  const { probe = true, probeAll = false } = options;
  const { lines, statements } = read(source);
  const text = lines.map((l) => l.text);
  const probes = [];

  for (const stmt of statements) {
    // The library's own names are already bound in the runner's scope, so the
    // import is noise; a third-party one is left in place to fail loudly.
    if (stmt.isImport) {
      // The specifier lives in a string, which the scanner blanks, so the
      // package name has to be matched against the untouched text.
      const raw = text.slice(stmt.start, stmt.end + 1).join('\n');
      if (/['"]@opentf\/std['"]/.test(raw)) {
        for (let i = stmt.start; i <= stmt.end; i++) text[i] = `// ${text[i]}`;
      }
      continue;
    }

    if (!probe) continue;
    if (!stmt.isExpression && !stmt.declared) continue;
    if (stmt.expected === null && !probeAll) continue;

    const id = probes.length;
    probes.push({
      id,
      line: stmt.end,
      expected: stmt.expected,
      expr: stmt.bare,
    });

    // The insertion point is before a trailing comment, so `//=> …` stays
    // visible at the end of the line exactly where the reader expects it.
    const last = lines[stmt.end];
    const cut = last.commentAt === -1 ? last.text.length : last.commentAt;
    const before = text[stmt.end].slice(0, cut).replace(/\s+$/, '');
    const after = text[stmt.end].slice(cut);

    if (stmt.declared) {
      // A declaration that relies on automatic semicolon insertion — one
      // ending in `.map(d => d.toString())` with no `;` — would swallow the
      // probe call as a continuation of its own expression.
      const semi = /;$/.test(before) ? '' : ';';
      text[stmt.end] =
        `${before}${semi} __probe(${id}, ${stmt.declared}); ${after}`;
      continue;
    }

    const trimmed = before.replace(/;$/, '');
    if (stmt.end === stmt.start) {
      text[stmt.end] = `__probe(${id}, (${trimmed})); ${after}`;
    } else {
      text[stmt.start] = `__probe(${id}, (${text[stmt.start]}`;
      text[stmt.end] = `${trimmed})); ${after}`;
    }
  }

  return { code: text.join('\n'), probes };
}
