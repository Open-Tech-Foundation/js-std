import randomString from './randomString';

const ALPHABET =
  '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generates a URL-friendly, cryptographically strong random ID.
 *
 * @param {number} [length=21] The length of the ID.
 * @returns {string} A random ID string.
 *
 * @example
 * randomId() //=> 'V1StGXR8_Z5jdHi6B-myT'
 */
export default function randomId(length = 21): string {
  return randomString(length, ALPHABET);
}
