import sum from './sum';

/**
 * Calculates the average value of the given array.
 *
 * @example
 *
 * mean([1, 2, 3]) //=> 2
 */

export default function mean(
  arr: number[] = [],
  cb?: (val: number, index: number) => number,
): number {
  if (arr.length === 0) {
    return NaN;
  }
  return sum(arr, cb) / arr.length;
}
