/**
 * Converts a Uint8Array of bytes to a string.
 *
 * @param {Uint8Array} bytes The byte array to convert.
 * @returns {string} The decoded string.
 *
 * @example
 * bytesToString(new Uint8Array([72, 101, 108, 108, 111])) //=> 'Hello'
 */

export default function bytesToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}
