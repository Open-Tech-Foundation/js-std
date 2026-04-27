/**
 * Replaces characters in a string at a specific index.
 *
 * @param {string} str The source string.
 * @param {number} [index=0] The index to start replacement.
 * @param {string} [replaceStr=''] The replacement string.
 * @returns {string} The modified string.
 *
 * @example
 * replaceAt('abc', 1, 'z') //=> 'azc'
 */
export default function replaceAt(
  str: string,
  index = 0,
  replaceStr = '',
): string {
  const rStrLen = index + (replaceStr.length === 0 ? 1 : replaceStr.length);

  return str.slice(0, index) + replaceStr + str.slice(rStrLen);
}
