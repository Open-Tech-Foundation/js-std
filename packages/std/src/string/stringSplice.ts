import validateStringCount from './validateStringCount';

/**
 * Returns true when the code unit at `index` is the trailing half of a
 * surrogate pair, meaning a cut there would leave a lone surrogate behind.
 */
function isSplitPoint(str: string, index: number): boolean {
  const code = str.charCodeAt(index);
  const prev = str.charCodeAt(index - 1);

  return code >= 0xdc00 && code <= 0xdfff && prev >= 0xd800 && prev <= 0xdbff;
}

/**
 * Removes characters from a string and inserts another in their place,
 * following `Array.prototype.splice`.
 *
 * Indices count UTF-16 code units, as `slice` and `indexOf` do, so a position
 * taken from either can be passed straight in. A boundary landing inside a
 * surrogate pair is widened to cover the whole character, so the result is
 * always well-formed.
 *
 * @param {string} str The source string.
 * @param {number} [start=0] The index to start changing the string at. A
 * negative index counts back from the end.
 * @param {number} [deleteCount] The number of characters to remove. Omit it to
 * remove everything from `start` onwards.
 * @param {string} [insert=''] The string to insert at `start`.
 * @returns {string} The modified string.
 *
 * @example
 *
 * stringSplice('2026-07-30', 5, 2, '08') //=> '2026-08-30'
 *
 * stringSplice('SELECT * FROM users', 19, 0, ' LIMIT 10') //=> 'SELECT * FROM users LIMIT 10'
 *
 * stringSplice('4111111111111111', 4, 8, '••••') //=> '4111••••1111'
 *
 * stringSplice('report.txt', -3, 3, 'csv') //=> 'report.csv'
 *
 * stringSplice('2026-07-30T09:15:00Z', -1) //=> '2026-07-30T09:15:00'
 */
export default function stringSplice(
  str: string,
  start = 0,
  deleteCount?: number,
  insert = '',
): string {
  if (!Number.isFinite(start) || !Number.isInteger(start)) {
    throw new RangeError('Start must be a finite integer.');
  }

  const len = str.length;
  let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);

  if (deleteCount !== undefined) {
    validateStringCount(deleteCount, 'Delete count');
  }
  const count = deleteCount === undefined ? len - from : deleteCount;

  let to = Math.min(from + count, len);
  const removesNothing = to === from;

  if (isSplitPoint(str, from)) {
    from--;
  }

  if (removesNothing) {
    // A pure insertion must stay one, so the end follows the start rather
    // than widening over the character the start was moved off.
    to = from;
  } else if (isSplitPoint(str, to)) {
    to++;
  }

  return str.slice(0, from) + insert + str.slice(to);
}
