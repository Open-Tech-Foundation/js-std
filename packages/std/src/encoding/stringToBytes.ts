/**
 * Converts a string to a Uint8Array of bytes.
 *
 * @param {string} str The string to convert.
 * @returns {Uint8Array} The byte array.
 *
 * @example
 * stringToBytes('Hello') //=> Uint8Array [72, 101, 108, 108, 111]
 */

export default function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}
