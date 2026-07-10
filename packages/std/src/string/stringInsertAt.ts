/**
 * Inserts a string at a specific index.
 *
 * @param {string} str The source string.
 * @param {number} [index=0] The index to insert at.
 * @param {string} [insertStr=''] The string to insert.
 * @returns {string} The modified string.
 *
 * @example
 * stringInsertAt('ac', 1, 'b') //=> 'abc'
 */
export default function stringInsertAt(
  str: string,
  index = 0,
  insertStr = '',
): string {
  if (!Number.isInteger(index) || index < 0) {
    throw new RangeError('The index must be a non-negative integer.');
  }

  return str.slice(0, index) + insertStr + str.slice(index);
}
