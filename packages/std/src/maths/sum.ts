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
  cb?: (val: number, index: number) => number
): number {
  const a = cb ? arr.map(cb) : arr;
  return a.reduce((prev, cur) => {
    return prev + cur;
  }, 0);
}
