const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function toUint8Array(bytes: Uint8Array | ArrayBuffer): Uint8Array {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}

export interface EncodeBase32Options {
  /** Keep the trailing `=` padding. Defaults to `true`. */
  pad?: boolean;
}

/**
 * Encodes bytes to a Base32 string using the standard RFC 4648 alphabet.
 *
 * This is the encoding used for TOTP/2FA shared secrets, which are normally
 * exchanged unpadded — pass `{ pad: false }` for those.
 *
 * @param {Uint8Array | ArrayBuffer} bytes The bytes to encode.
 * @param {{ pad?: boolean }} [options] Set `pad` to `false` to omit the `=` padding.
 * @returns {string} The Base32 string.
 *
 * @example
 * encodeBase32(new Uint8Array([72, 101, 108, 108, 111])) //=> 'JBSWY3DP'
 *
 * @example
 * encodeBase32(stringToBytes('Hi'), { pad: false }) //=> 'JBUQ'
 */
export default function encodeBase32(
  bytes: Uint8Array | ArrayBuffer,
  options: EncodeBase32Options = {},
): string {
  const { pad = true } = options;
  const input = toUint8Array(bytes);

  let out = '';
  let buffer = 0;
  let bits = 0;

  for (let i = 0; i < input.length; i++) {
    buffer = (buffer << 8) | input[i];
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      out += BASE32_ALPHABET[(buffer >>> bits) & 0x1f];
    }
  }

  // Flush the remaining bits, zero-padded on the right.
  if (bits > 0) {
    out += BASE32_ALPHABET[(buffer << (5 - bits)) & 0x1f];
  }

  if (pad) {
    while (out.length % 8 !== 0) {
      out += '=';
    }
  }

  return out;
}
