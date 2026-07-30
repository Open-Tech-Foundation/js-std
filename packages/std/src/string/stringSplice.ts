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
 * stringSplice('abcdef', 2, 2, 'XY') //=> 'abXYef'
 *
 * stringSplice('ac', 1, 0, 'b') //=> 'abc'
 *
 * stringSplice('abc', 1, 1) //=> 'ac'
 *
 * stringSplice('abcdef', 2) //=> 'ab'
 *
 * stringSplice('abcdef', -2, 2, 'XY') //=> 'abcdXY'
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
