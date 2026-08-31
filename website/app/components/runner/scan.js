/**
 * A character scanner for the documentation examples.
 *
 * The runner has to answer two questions about a block of example code: where
 * does each top-level statement end, and which of those statements carry a
 * `//=>` result comment. Both need to ignore anything inside a string, a
 * template, a comment, or a nested bracket — `chunk(['a//=> b'], 2)` is one
 * statement with no annotation — so a regular expression over the raw text is
 * not enough, and a full parser is far more than this needs.
 *
 * The scanner walks the source once and reports, per line, the bracket depth it
 * ends at, the offset of a trailing line comment, and a `code` view of the line
 * with every string, comment, and regex body blanked to spaces. Offsets in that
 * view line up with the original, so a caller can search it for punctuation and
 * still splice the real text. That is the whole surface; `transform.js` builds
 * statements out of it.
 */

/**
 * Characters after which a `/` opens a regular expression rather than dividing.
 *
 * The `/` in `stringReplace('abc', /b/, 'x')` follows a comma and starts a
 * literal; the one in `(a + b) / 2` follows `)` and is division. Tracking the
 * last significant character separates the two without parsing expressions.
 * Keywords are handled alongside, since `return /a/.test(s)` divides nothing.
 */
const REGEX_PRECEDERS = new Set([
  '(',
  ',',
  '=',
  ':',
  '[',
  '!',
  '&',
  '|',
  '?',
  '{',
  '}',
  ';',
  '+',
  '-',
  '*',
  '%',
  '<',
  '>',
  '~',
  '^',
  '\n',
]);

const REGEX_KEYWORDS = new Set([
  'return',
  'typeof',
  'instanceof',
  'in',
  'of',
  'new',
  'delete',
  'void',
  'throw',
  'case',
  'do',
  'else',
  'yield',
  'await',
]);

const OPENERS = { '(': ')', '[': ']', '{': '}' };
const CLOSERS = new Set([')', ']', '}']);

/** Whether the `/` at `i` opens a regex, judged by what precedes it. */
function opensRegex(source, i) {
  let j = i - 1;
  while (j >= 0 && (source[j] === ' ' || source[j] === '\t')) j--;
  if (j < 0) return true;

  const ch = source[j];
  if (REGEX_PRECEDERS.has(ch)) return true;

  // A word before the slash is either a keyword (regex) or a value (division).
  if (/[A-Za-z_$]/.test(ch)) {
    let k = j;
    while (k >= 0 && /[\w$]/.test(source[k])) k--;
    return REGEX_KEYWORDS.has(source.slice(k + 1, j + 1));
  }
  return false;
}

/**
 * Scans `source` into one record per line.
 *
 * Each record carries the line's text, the bracket depth *after* the line, and
 * `commentAt` — the offset within the line of a `//` that is real code
 * punctuation rather than string content, or -1. A line whose depth is 0 has
 * closed everything it opened, which is what lets the caller treat it as the
 * end of a statement.
 */
export default function scan(source) {
  const lines = source.split('\n');
  const out = [];

  // `stack` holds the open brackets plus template-literal contexts, so a `}`
  // knows whether it closes an object or resumes a template after `${`.
  const stack = [];
  let mode = 'code';
  let quote = '';
  let offset = 0;

  for (const text of lines) {
    let commentAt = -1;
    // Same length as `text`, so an offset found here indexes the real line.
    const code = text.split('');

    const blank = (from, to) => {
      for (let k = from; k < to && k < code.length; k++) code[k] = ' ';
    };

    for (let i = 0; i < text.length; i++) {
      if (mode !== 'code') code[i] = ' ';
      const ch = text[i];
      const next = text[i + 1];
      const abs = offset + i;

      if (mode === 'block-comment') {
        if (ch === '*' && next === '/') {
          mode = 'code';
          i++;
        }
        continue;
      }

      if (mode === 'string') {
        if (ch === '\\') {
          i++;
        } else if (ch === quote) {
          mode = 'code';
        } else if (quote === '`' && ch === '$' && next === '{') {
          stack.push('${');
          mode = 'code';
          i++;
        }
        continue;
      }

      if (mode === 'regex') {
        if (ch === '\\') i++;
        else if (ch === '[') mode = 'regex-class';
        else if (ch === '/') mode = 'code';
        continue;
      }

      if (mode === 'regex-class') {
        if (ch === '\\') i++;
        else if (ch === ']') mode = 'regex';
        continue;
      }

      if (ch === '/' && next === '/') {
        commentAt = i;
        blank(i, text.length);
        break;
      }

      if (ch === '/' && next === '*') {
        mode = 'block-comment';
        blank(i, i + 2);
        i++;
        continue;
      }

      if (ch === '/' && opensRegex(source, abs)) {
        mode = 'regex';
        continue;
      }

      if (ch === "'" || ch === '"' || ch === '`') {
        mode = 'string';
        quote = ch;
        continue;
      }

      if (OPENERS[ch]) {
        stack.push(ch);
        continue;
      }

      if (CLOSERS.has(ch)) {
        // `}` closing a `${` hands control back to the template it interrupted.
        if (ch === '}' && stack.at(-1) === '${') {
          stack.pop();
          mode = 'string';
          quote = '`';
          continue;
        }
        if (stack.length) stack.pop();
      }
    }

    // A line comment ends at the newline; an unterminated string does not, but
    // only a template literal may legally span lines.
    if (mode === 'string' && quote !== '`') mode = 'code';

    out.push({
      text,
      code: code.join(''),
      commentAt,
      depth: mode === 'string' || mode === 'block-comment' ? 1 : stack.length,
    });
    offset += text.length + 1;
  }

  return out;
}
