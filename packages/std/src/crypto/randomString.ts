import randomInt from './randomInt';

const DEFAULT_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** The longest string this will build. */
export const MAX_RANDOM_LENGTH = 65_536;

/**
 * Generates a cryptographically strong random string.
 *
 * The length is bounded. `Number.isInteger` is true of `1e308`, so a length
 * taken from a caller used to pass the check and then loop past the age of the
 * universe — one draw from the random source per character, with no way out.
 * A limit turns that into an error at the call.
 *
 * @param {number} [length=10] How many characters to generate.
 * @param {string} [chars] The alphabet to draw from.
 * @returns {string} The random string.
 *
 * @throws {RangeError} If `length` is not a non-negative safe integer, is
 * above `MAX_RANDOM_LENGTH`, or `chars` is empty.
 *
 * @example
 *
 * randomString(10) //=> 'aB3dE5gH1j'
 * randomString(5, '01') //=> '10110'
 */
export default function randomString(
  length = 10,
  chars: string = DEFAULT_CHARS,
): string {
  if (!Number.isSafeInteger(length) || length < 0) {
    throw new RangeError('The length must be a non-negative safe integer.');
  }

  if (length > MAX_RANDOM_LENGTH) {
    throw new RangeError(`The length must not exceed ${MAX_RANDOM_LENGTH}.`);
  }

  if (chars.length === 0) {
    throw new RangeError('The character set must not be empty.');
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomInt(0, chars.length - 1)];
  }
  return result;
}
