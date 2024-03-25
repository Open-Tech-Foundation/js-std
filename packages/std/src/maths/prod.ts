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
  cb?: (val: number, index: number) => number
) {
  const a = cb ? arr.map(cb) : arr;
  return a.reduce((prev, cur) => {
    return prev * cur;
  }, 1);
}
