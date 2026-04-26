/**
 * Calculates the sum of values in the given array.
 *
 * @example
 *
 * sum([1, 2, 3, 4, 5]) //=> 15
 * sum([-1, -2]) //=> -3
 */

export default function sum<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number,
): number {
  return (arr as unknown[]).reduce((prev: number, cur, i) => {
    return prev + (cb ? cb(cur as T, i) : (cur as number));
  }, 0);
}
