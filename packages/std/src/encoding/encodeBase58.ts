const BASE58_ALPHABET =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function toUint8Array(bytes: Uint8Array | ArrayBuffer): Uint8Array {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}

/**
 * Encodes bytes to a Base58 string using the Bitcoin alphabet.
 *
 * Base58 drops the characters that are easy to confuse when read or typed by a
 * human (`0`, `O`, `I` and `l`) and uses no punctuation, so the result survives
 * double-click selection and URLs unescaped. It is the encoding behind Bitcoin
 * and Solana addresses, IPFS CIDv0 hashes and short public identifiers.
 *
 * Unlike Base64, Base58 is a whole-number base conversion rather than a bit
 * regrouping, so it has no fixed block size and no padding. Leading zero bytes
 * carry no numeric weight, so they are preserved separately as leading `1`s.
 *
 * @param {Uint8Array | ArrayBuffer} bytes The bytes to encode.
 * @returns {string} The Base58 string.
 *
 * @example
 * encodeBase58(new Uint8Array([72, 101, 108, 108, 111])) //=> '9Ajdvzr'
 *
 * @example
 * encodeBase58(new Uint8Array([0, 0, 1])) //=> '112'
 */
/**
 * The most bytes this will encode.
 *
 * Base58 has no block structure — every byte carries into the whole
 * accumulator — so encoding is quadratic in the length of the input, as
 * decoding is. 100,000 bytes took 57 seconds.
 *
 * The encoding is used for identifiers, which are short: a Bitcoin address is
 * 25 bytes before encoding, an IPFS CIDv0 34. The limit is far above those and
 * holds the worst case to well under a second.
 */
export const MAX_BASE58_BYTES = 3072;

export default function encodeBase58(bytes: Uint8Array | ArrayBuffer): string {
  const input = toUint8Array(bytes);

  if (input.length > MAX_BASE58_BYTES) {
    throw new RangeError(
      `The Base58 input must not exceed ${MAX_BASE58_BYTES} bytes.`,
    );
  }

  if (input.length === 0) {
    return '';
  }

  let zeros = 0;
  while (zeros < input.length && input[zeros] === 0) {
    zeros++;
  }

  // log(256) / log(58) ≈ 1.365, so 138/100 is a safe upper bound per byte.
  const size = Math.floor(((input.length - zeros) * 138) / 100) + 1;
  const digits = new Uint8Array(size);
  let length = 0;

  for (let i = zeros; i < input.length; i++) {
    let carry = input[i];
    let j = 0;

    for (let k = size - 1; (carry !== 0 || j < length) && k >= 0; k--, j++) {
      carry += 256 * digits[k];
      digits[k] = carry % 58;
      carry = Math.floor(carry / 58);
    }

    length = j;
  }

  let index = size - length;
  while (index < size && digits[index] === 0) {
    index++;
  }

  let out = '1'.repeat(zeros);
  for (; index < size; index++) {
    out += BASE58_ALPHABET[digits[index]];
  }

  return out;
}
