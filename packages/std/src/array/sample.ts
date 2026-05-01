import randomInt from '../crypto/randomInt';

/**
 * Returns a random element from the given array.
 *
 * @param {T[]} arr The source array.
 * @returns {T | undefined} A random element, or undefined if empty.
 *
 * @example
 * sample([1, 2, 3]) //=> 1, 2, or 3
 */
export default function sample<T>(arr: T[] = []): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  return arr[randomInt(0, arr.length - 1)];
}
