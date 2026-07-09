const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function toUint8Array(bytes: Uint8Array | ArrayBuffer): Uint8Array {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}

/**
 * Encodes bytes to a Base64 string.
 *
 * @example
 * encodeBase64(new Uint8Array([72, 101, 108, 108, 111])) //=> 'SGVsbG8='
 */
export default function encodeBase64(bytes: Uint8Array | ArrayBuffer): string {
  const input = toUint8Array(bytes);
  let out = '';

  for (let i = 0; i < input.length; i += 3) {
    const a = input[i];
    const b = input[i + 1];
    const c = input[i + 2];
    const triple = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);

    out += BASE64_ALPHABET[(triple >> 18) & 0x3f];
    out += BASE64_ALPHABET[(triple >> 12) & 0x3f];
    out += b === undefined ? '=' : BASE64_ALPHABET[(triple >> 6) & 0x3f];
    out += c === undefined ? '=' : BASE64_ALPHABET[triple & 0x3f];
  }

  return out;
}
