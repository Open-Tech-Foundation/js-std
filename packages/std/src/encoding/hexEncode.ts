/**
 * Encodes a string to Hex format.
 *
 * @param {string} str The string to encode.
 * @returns {string} The Hex encoded string.
 *
 * @example
 * hexEncode('Hello') //=> '48656c6c6f'
 */
export default function hexEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('hex');
  }

  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
