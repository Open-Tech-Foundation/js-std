import sum from './sum';

/**
 * Calculates the average of values in the given array.
 *
 * @example
 *
 * avg([1, 2, 3, 4, 5]) //=> 3
 * avg([-1, -2]) //=> -1.5
 */
export default function avg(
  arr: number[] = [],
  cb?: (val: number, index: number) => number
): number {
  const s = sum(arr, cb);

  return s / arr.length || 0;
}
