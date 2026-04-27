/**
 * Decodes a Hex string.
 *
 * @param {string} str The Hex string to decode.
 * @returns {string} The decoded string.
 *
 * @example
 * hexDecode('48656c6c6f') //=> 'Hello'
 */
export default function hexDecode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'hex').toString('utf-8');
  }

  const bytes = new Uint8Array(
    str.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)),
  );
  return new TextDecoder().decode(bytes);
}
