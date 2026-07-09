/**
 * Decodes a hexadecimal string to bytes.
 *
 * @example
 * decodeHex('48656c6c6f') //=> Uint8Array [72, 101, 108, 108, 111]
 */
export default function decodeHex(str: string): Uint8Array {
  if (str.length % 2 !== 0) {
    throw new Error('Hex string must have an even length.');
  }

  if (!/^[\da-f]*$/i.test(str)) {
    throw new Error('Invalid hex string.');
  }

  const bytes = new Uint8Array(str.length / 2);
  for (let i = 0; i < str.length; i += 2) {
    bytes[i / 2] = Number.parseInt(str.slice(i, i + 2), 16);
  }

  return bytes;
}
