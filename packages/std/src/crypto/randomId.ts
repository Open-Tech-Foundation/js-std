import randomString from './randomString';

const ALPHABET =
  '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generates a URL-friendly, cryptographically strong random ID.
 *
 * The length is bounded by `MAX_RANDOM_LENGTH`, so a length taken from a
 * caller cannot turn into an unbounded loop.
 *
 * @param {number} [length=21] The length of the ID.
 * @returns {string} A random ID string.
 *
 * @throws {RangeError} If `length` is not a non-negative safe integer or is
 * above `MAX_RANDOM_LENGTH`.
 *
 * @example
 * randomId() //=> 'V1StGXR8_Z5jdHi6B-myT'
 */
export default function randomId(length = 21): string {
  // randomString applies the bound; checking here too would only duplicate it.
  return randomString(length, ALPHABET);
}
