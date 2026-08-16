const BASE58_ALPHABET =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const BASE58_LOOKUP = new Map(
  Array.from(BASE58_ALPHABET, (char, index) => [char, index]),
);

/**
 * Decodes a Base58 string using the Bitcoin alphabet.
 *
 * Base58 is case-sensitive, and `0`, `O`, `I` and `l` are not part of the
 * alphabet, so they are rejected rather than corrected.
 *
 * @param {string} str The Base58 string to decode.
 * @returns {Uint8Array} The decoded bytes.
 * @throws {Error} If the string holds a non-Base58 character.
 *
 * @example
 * decodeBase58('9Ajdvzr') //=> Uint8Array [72, 101, 108, 108, 111]
 *
 * @example
 * decodeBase58('112') //=> Uint8Array [0, 0, 1]
 */
/**
 * The longest Base58 string this will decode.
 *
 * Base58 has no block structure — every character carries into the whole
 * accumulator — so decoding is quadratic in the length of the input, and that
 * is a property of the encoding rather than of this implementation. 16,000
 * characters take about half a second, 50,000 take five, and the curve keeps
 * going.
 *
 * The encoding is used for identifiers, which are short: a Bitcoin address is
 * about 35 characters, an IPFS CIDv0 is 46, an extended key 111. The limit is
 * far above all of them and holds the worst case to roughly 90 ms.
 */
export const MAX_BASE58_LENGTH = 4096;

export default function decodeBase58(str: string): Uint8Array {
  if (str.length > MAX_BASE58_LENGTH) {
    throw new RangeError(
      `The Base58 input must not exceed ${MAX_BASE58_LENGTH} characters.`,
    );
  }

  if (str.length === 0) {
    return new Uint8Array(0);
  }

  let zeros = 0;
  while (zeros < str.length && str[zeros] === '1') {
    zeros++;
  }

  // log(58) / log(256) ≈ 0.733, so 733/1000 is a safe upper bound per digit.
  const size = Math.floor(((str.length - zeros) * 733) / 1000) + 1;
  const bytes = new Uint8Array(size);
  let length = 0;

  for (let i = zeros; i < str.length; i++) {
    const value = BASE58_LOOKUP.get(str[i]);

    if (value === undefined) {
      throw new Error('Invalid Base58 character.');
    }

    let carry = value;
    let j = 0;

    for (let k = size - 1; (carry !== 0 || j < length) && k >= 0; k--, j++) {
      carry += 58 * bytes[k];
      bytes[k] = carry % 256;
      carry = Math.floor(carry / 256);
    }

    length = j;
  }

  let index = size - length;
  while (index < size && bytes[index] === 0) {
    index++;
  }

  const out = new Uint8Array(zeros + (size - index));
  let outIndex = zeros;
  while (index < size) {
    out[outIndex++] = bytes[index++];
  }

  return out;
}
