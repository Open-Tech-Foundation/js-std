/**
 * Calculates the product of values in the given array.
 *
 * @example
 *
 * prod([1, 2, 3, 4, 5]) //=> 120
 * prod([-1, -2]) //=> 2
 */

export default function prod(
  arr: number[] = [],
  cb?: (val: number, index: number) => number,
): number {
  return arr.reduce((prev, cur, i) => {
    return prev * (cb ? cb(cur, i) : cur);
  }, 1);
}
