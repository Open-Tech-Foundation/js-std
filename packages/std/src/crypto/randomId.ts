import randomString from './randomString';

const ALPHABET =
  '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generates a URL-friendly, cryptographically strong random ID.
 * (Similar to NanoID)
 *
 * @example
 *
 * randomId() //=> 'V1StGXR8_Z5jdHi6B-myT'
 * randomId(10) //=> 'h6fG_2jK8L'
 */
export default function randomId(length: number = 21): string {
  return randomString(length, ALPHABET);
}
