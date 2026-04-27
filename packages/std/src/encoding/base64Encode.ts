/**
 * Encodes a string to Base64 format.
 *
 * @param {string} str The string to encode.
 * @returns {string} The Base64 encoded string.
 *
 * @example
 * base64Encode('Hello') //=> 'SGVsbG8='
 */
export default function base64Encode(str: string): string {
  const bytes = new TextEncoder().encode(str);

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
