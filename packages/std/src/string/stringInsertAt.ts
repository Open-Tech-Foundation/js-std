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
  return str.slice(0, index) + insertStr + str.slice(index);
}
