import collectPresentValues from './collectPresentValues';

/**
 * Calculates the mean value of the given array.
 *
 * @example
 *
 * mean([4, 2, 8]) //=> 4.666666666666667
 */

export default function mean<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number,
): number {
  const values = collectPresentValues(arr, cb);

  if (values.length === 0) {
    return Number.NaN;
  }

  const total = values.reduce((prev, cur) => prev + cur, 0);
  return total / values.length;
}
