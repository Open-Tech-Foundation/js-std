const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const BASE32_LOOKUP = new Map(
  Array.from(BASE32_ALPHABET, (char, index) => [char, index]),
);

// A Base32 group is 8 characters. Only these remainders can be produced by a
// whole number of input bytes; 1, 3 and 6 mean the string was truncated.
const VALID_REMAINDERS = new Set([0, 2, 4, 5, 7]);

/**
 * Decodes a Base32 string using the standard RFC 4648 alphabet.
 *
 * Padding is optional, whitespace is ignored and lowercase input is accepted,
 * so TOTP/2FA secrets can be passed in the form users normally see them.
 *
 * @param {string} str The Base32 string to decode.
 * @returns {Uint8Array} The decoded bytes.
 * @throws {Error} If the string is truncated or holds a non-Base32 character.
 *
 * @example
 * decodeBase32('JBSWY3DP') //=> Uint8Array [72, 101, 108, 108, 111]
 *
 * @example
 * bytesToString(decodeBase32('jbsw y3dp')) //=> 'Hello'
 */
export default function decodeBase32(str: string): Uint8Array {
  const input = str.replace(/\s/g, '').replace(/=+$/, '').toUpperCase();

  if (input.includes('=')) {
    throw new Error('Invalid Base32 padding.');
  }

  if (!VALID_REMAINDERS.has(input.length % 8)) {
    throw new Error('Invalid Base32 string length.');
  }

  const out = new Uint8Array(Math.floor((input.length * 5) / 8));
  let outIndex = 0;
  let buffer = 0;
  let bits = 0;

  for (let i = 0; i < input.length; i++) {
    const value = BASE32_LOOKUP.get(input[i]);

    if (value === undefined) {
      throw new Error('Invalid Base32 character.');
    }

    buffer = (buffer << 5) | value;
    bits += 5;

    if (bits >= 8) {
      bits -= 8;
      out[outIndex++] = (buffer >>> bits) & 0xff;
    }
  }

  return out;
}
