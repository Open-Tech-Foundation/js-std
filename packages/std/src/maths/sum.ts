/**
 * Calculates the sum of values in the given array.
 *
 * @param {T[]} arr The source array.
 * @param {Function} cb The iteratee invoked per element.
 * @returns {number} The sum of values.
 *
 * @example
 * sum([1, 2, 3, 4, 5]) //=> 15
 */

export default function sum<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number,
): number {
  return (arr as unknown[]).reduce((prev: number, cur, i) => {
    return prev + (cb ? cb(cur as T, i) : (cur as number));
  }, 0);
}
