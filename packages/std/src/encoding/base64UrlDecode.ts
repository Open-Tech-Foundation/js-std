/**
 * Decodes a Base64 URL-safe string.
 *
 * @param {string} str The Base64 URL-encoded string to decode.
 * @returns {string} The decoded string.
 *
 * @example
 * base64UrlDecode('aGVsbG8_d29ybGQ=') //=> 'hello?world'
 * base64UrlDecode('aGVsbG8_d29ybGQ') //=> 'hello?world'
 */

export default function base64UrlDecode(str: string): string {
  let decoded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = decoded.length % 4;
  if (pad) {
    decoded += '='.repeat(4 - pad);
  }
  return decodeURIComponent(escape(atob(decoded)));
}
