import sum from './sum';

/**
 * Calculates the mean value of the given array.
 *
 * @example
 *
 * mean([4, 1, 7]) //=> 4
 */

export default function mean(
  arr: number[] = [],
  cb?: (v: number, index: number) => number
): number {
  const a = cb ? arr.map(cb) : arr;
  return sum(a) / a.length;
}
