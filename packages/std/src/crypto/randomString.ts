import randomInt from './randomInt';

const DEFAULT_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a cryptographically strong random string.
 *
 * @example
 *
 * randomString(10) //=> 'aB3dE5gH1j'
 * randomString(5, '01') //=> '10110'
 */
export default function randomString(
  length: number,
  chars: string = DEFAULT_CHARS,
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomInt(0, chars.length - 1)];
  }
  return result;
}
