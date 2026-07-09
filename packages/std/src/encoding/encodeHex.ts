function toUint8Array(bytes: Uint8Array | ArrayBuffer): Uint8Array {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}

/**
 * Encodes bytes to a hexadecimal string.
 *
 * @example
 * encodeHex(new Uint8Array([72, 101, 108, 108, 111])) //=> '48656c6c6f'
 */
export default function encodeHex(bytes: Uint8Array | ArrayBuffer): string {
  return Array.from(toUint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
