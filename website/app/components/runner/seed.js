import read from './statements.js';

/**
 * Strips TypeScript-specific syntax from a line of code, converting it to
 * plain JavaScript.
 */
function stripTypeScript(line) {
  let s = line;

  // Remove entire lines: type Foo = ... and declare const ...
  if (/^\s*type\s+\w/.test(s) || /^\s*declare\s+/.test(s)) return '';

  // Generic function calls: fn<Type>( → fn(
  s = s.replace(/\b(\w+)\s*<[^>]+>\s*\(/g, '$1(');

  // Non-null assertions (but not != or !==)
  s = s.replace(/([)\]\\w])\s*!(?!=)/g, '$1');

  // 'as Type' assertions: expr as Type → expr
  s = s.replace(/(\)|[\w$])\s+as\s+[A-Za-z_$][\w$]*/g, '$1');

  // Variable type annotations: const/let/var name: Type = → const/let/var name =
  s = s.replace(
    /^(\s*(?:const|let|var)\s+\w+)\s*:\s*[A-Za-z_$][\w$]*(?:\s*\|[^=]+)?(?=\s*=)/,
    '$1',
  );

  // Arrow function parameter types: (param: Type) → (param)
  s = s.replace(/(\(\s*|\,\s*)(\w+)\s*:\s*[A-Za-z_$][\w$]*/g, '$1$2');

  // Return type annotation: ): Type → )
  s = s.replace(/\)\s*:\s*[A-Za-z_$][\w$]*/g, ')');

  return s;
}

export function seedFromExample(source) {
  const js = source.split('\n').map(stripTypeScript).join('\n');
  const { lines, statements } = read(js);
  const text = lines.map((l) => l.text);

  for (const stmt of statements) {
    if (stmt.isImport || !stmt.isExpression) continue;
    if (stmt.expected === null) continue;

    const last = lines[stmt.end];
    const cut = last.commentAt === -1 ? last.text.length : last.commentAt;
    const before = text[stmt.end].slice(0, cut).replace(/\s+$/, '');
    const after = text[stmt.end].slice(cut);
    const indent = /^\s*/.exec(text[stmt.start])[0];

    if (stmt.end === stmt.start) {
      const body = before.slice(indent.length).replace(/;$/, '');
      text[stmt.end] = `${indent}console.log(${body}); ${after}`.trimEnd();
      continue;
    }

    const head = text[stmt.start].slice(indent.length);
    text[stmt.start] = `${indent}console.log(${head}`;
    text[stmt.end] = `${before.replace(/;$/, '')}); ${after}`.trimEnd();
  }

  return text.join('\n').replace(/^\n+/, '').trimEnd();
}

/** Joins related examples into one runnable sample. */
export default function seed(examples, options = {}) {
  const body = examples
    .map(seedFromExample)
    .filter((example) => example.trim() !== '')
    .join('\n\n');

  return options.header ? `${options.header}\n\n${body}\n` : `${body}\n`;
}
