/**
 * Encodes a string to Base64 URL-safe format.
 *
 * @param {string} str The string to encode.
 * @param {object} options The options object.
 * @param {boolean} options.pad Whether to add padding (default true).
 * @returns {string} The Base64 URL-encoded string.
 *
 * @example
 * base64UrlEncode('hello?world') //=> 'aGVsbG8_d29ybGQ='
 * base64UrlEncode('hello?world', { pad: false }) //=> 'aGVsbG8_d29ybGQ'
 */

export default function base64UrlEncode(
  str: string,
  options: { pad?: boolean } = {},
): string {
  const { pad = true } = options;
  let encoded = btoa(unescape(encodeURIComponent(str)));
  encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
  if (!pad) {
    encoded = encoded.replace(/=+$/, '');
  }
  return encoded;
}
