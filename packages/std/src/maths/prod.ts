import isEmpty from '../assert/isEmpty';

/**
 * Calculates the product of values in the given array.
 *
 * @example
 *
 * prod([1, 2, 3, 4, 5]) //=> 120
 */

export default function prod<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number,
): number {
  if (isEmpty(arr)) {
    return 1;
  }
  return (arr as unknown[]).reduce((prev: number, cur, i) => {
    return prev * (cb ? cb(cur as T, i) : (cur as number));
  }, 1);
}
