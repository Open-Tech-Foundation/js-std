const INDENT = /^[ \t]*/;

/**
 * Removes the common leading indentation from every line of a string.
 *
 * A template literal inside an indented block carries that indentation into the
 * string, so an SQL query, a help message or a fixture written where it is used
 * comes out with the surrounding code's whitespace in it. The alternative is to
 * unindent the literal to the left margin, which makes the code harder to read
 * to keep the string right. This does it the other way round.
 *
 * The smallest indentation of any non-blank line is removed from all of them.
 * Relative indentation is therefore preserved: a nested clause stays nested.
 * Blank lines are ignored when measuring — one is often left with no
 * whitespace at all by an editor trimming it, and counting it would remove
 * nothing from anything — and are emptied rather than sliced, since a blank
 * line's whitespace is only ever trailing.
 *
 * A leading newline and a trailing line of only whitespace are dropped, since
 * both are artefacts of putting the opening and closing backticks on their own
 * lines rather than content anyone meant.
 *
 * Indentation is compared as a count of leading spaces and tabs, so a block
 * indented with a mixture of the two may not line up the way it looks. Consistent
 * indentation is measured exactly.
 *
 * @param {string} str The string to dedent.
 * @returns {string} The string with its common indentation removed.
 *
 * @example
 * dedent(`
 *     SELECT *
 *       FROM users
 *      WHERE id = 1
 * `)
 * //=> 'SELECT *\n  FROM users\n WHERE id = 1'
 *
 * @example
 * dedent('  a\n    b') //=> 'a\n  b'
 */
export default function dedent(str = ''): string {
  const lines = str.split('\n');

  // The backticks of a multi-line template sit on their own lines, leaving an
  // empty first line and a whitespace-only last one that were never content.
  if (lines.length > 1 && lines[0].trim() === '') {
    lines.shift();
  }

  if (lines.length > 1 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  let common = Number.POSITIVE_INFINITY;

  for (const line of lines) {
    if (line.trim() === '') {
      continue;
    }

    const indent = (line.match(INDENT) as RegExpMatchArray)[0].length;

    if (indent < common) {
      common = indent;
    }
  }

  // Every line is blank, so there is no indentation to measure against.
  const width = common === Number.POSITIVE_INFINITY ? 0 : common;

  // A blank line is emptied rather than sliced. It may hold less whitespace
  // than the common indent, or more that is only trailing.
  return lines
    .map((line) => (line.trim() === '' ? '' : line.slice(width)))
    .join('\n');
}
