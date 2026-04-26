/**
 * Calculates the sum of values in the given array.
 *
 * @example
 *
 * sum([1, 2, 3, 4, 5]) //=> 15
 * sum([-1, -2]) //=> -3
 */

export default function sum(
  arr: number[] = [],
  cb?: (val: number, index: number) => number,
): number {
  return arr.reduce((prev, cur, i) => {
    return prev + (cb ? cb(cur, i) : cur);
  }, 0);
}
