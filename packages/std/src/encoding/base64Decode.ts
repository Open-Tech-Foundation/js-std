/**
 * Decodes a Base64 string.
 *
 * @param {string} str The Base64 string to decode.
 * @returns {string} The decoded string.
 *
 * @example
 * base64Decode('SGVsbG8=') //=> 'Hello'
 */
export default function base64Decode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
