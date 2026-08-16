import { getCrypto } from './getCrypto';

const TWO_POW_32 = 4294967296;
const TWO_POW_64 = 18446744073709551616n;

/**
 * Generates a cryptographically strong random integer within an inclusive range.
 *
 * Uses the standard Web Crypto API (`globalThis.crypto`).
 *
 * The result is uniform. A random word is taken and reduced modulo the range,
 * which on its own would favour the low end — the words do not divide evenly
 * into the range, so the first `2**32 % range` results have one more word
 * mapping to them than the rest. Words in that remainder are drawn again
 * instead, leaving a count that the range divides exactly.
 *
 * @param {number} min The lower bound, inclusive.
 * @param {number} max The upper bound, inclusive.
 * @returns {number} A random integer between `min` and `max`.
 *
 * @throws {RangeError} If either bound is not an integer, or the range is
 * wider than `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * randomInt(1, 10) //=> 7
 */
export default function randomInt(min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new RangeError('The min and max values must be integers.');
  }

  if (min > max) {
    throw new Error(
      'The min value must be less than or equal to the max value.',
    );
  }

  // Checked on the span rather than the count: a span of MAX_SAFE_INTEGER is a
  // legitimate call whose count is one above it, and still exact.
  if (!Number.isSafeInteger(max - min)) {
    throw new RangeError(
      'The span between min and max must not exceed Number.MAX_SAFE_INTEGER.',
    );
  }

  const range = max - min + 1;

  if (range <= TWO_POW_32) {
    // The largest multiple of `range` that fits in 32 bits. A range of exactly
    // 2**32 divides evenly and nothing is rejected.
    const limit = TWO_POW_32 - (TWO_POW_32 % range);
    const buf = new Uint32Array(1);
    let val: number;

    do {
      getCrypto().getRandomValues(buf);
      val = buf[0] as number;
    } while (val >= limit);

    return min + (val % range);
  }

  // A range wider than a word needs a wider draw; 64 bits covers every range
  // up to Number.MAX_SAFE_INTEGER.
  const bigRange = BigInt(range);
  const bigLimit = TWO_POW_64 - (TWO_POW_64 % bigRange);
  const buf = new BigUint64Array(1);
  let val: bigint;

  do {
    getCrypto().getRandomValues(buf);
    val = buf[0] as bigint;
  } while (val >= bigLimit);

  return min + Number(val % bigRange);
}
