/**
 * Replaces characters in a string at a specific index.
 *
 * It overwrites as many characters as `replaceStr` is long, so the result keeps
 * the length of the source string. An empty `replaceStr` removes one character.
 *
 * @param {string} str The source string.
 * @param {number} [index=0] The index to start replacement.
 * @param {string} [replaceStr=''] The replacement string.
 * @returns {string} The modified string.
 *
 * @example
 * stringReplaceAt('abc', 1, 'z') //=> 'azc'
 *
 * stringReplaceAt('I HATE U', 2, 'LUV') //=> 'I LUVE U'
 */
export default function stringReplaceAt(
  str: string,
  index = 0,
  replaceStr = '',
): string {
  if (!Number.isInteger(index) || index < 0) {
    throw new RangeError('The index must be a non-negative integer.');
  }

  const rStrLen = index + (replaceStr.length === 0 ? 1 : replaceStr.length);

  return str.slice(0, index) + replaceStr + str.slice(rStrLen);
}
