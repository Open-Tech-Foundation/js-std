import read from './statements.js';

/**
 * Builds the code the Try it editor opens with, from the page's own examples.
 *
 * The examples are written to be read — a result is a `//=>` comment beside the
 * call, not something the program does — so pasting them into an editor gives a
 * page that runs and prints nothing. Each annotated expression becomes a
 * `console.log`, which is what a reader would have written themselves, and the
 * documented result stays beside it so the sample still says what to expect.
 *
 * Statements that are not annotated are left exactly as they are: the setup a
 * page builds before its calls is part of the sample, and so is the import.
 */
export function seedFromExample(source) {
  const { lines, statements } = read(source);
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

  return text.join('\n').trimEnd();
}

/**
 * Joins a page's examples into one sample.
 *
 * Several pages are written as one session — a cache built in the first block
 * is read in the second — so the blocks are concatenated in the order they
 * appear rather than offered as separate samples.
 *
 * @param {string[]} examples The source of each example block on the page.
 * @param {{ header?: string }} [options] `header` leads the sample, and is the
 *   import a reader would write in their own project.
 */
export default function seed(examples, options = {}) {
  const body = examples
    .map(seedFromExample)
    .filter((example) => example.trim() !== '')
    .join('\n\n');

  return options.header ? `${options.header}\n\n${body}\n` : `${body}\n`;
}
