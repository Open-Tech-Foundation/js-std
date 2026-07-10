import collectPresentValues from './collectPresentValues';

/**
 * Calculates the population standard deviation of the given array.
 *
 * @example
 *
 * stddev([2, 4, 4, 4, 5, 5, 7, 9]) //=> 2
 */
export default function stddev<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number,
): number {
  const values = collectPresentValues(arr, cb);
  if (values.length === 0) return Number.NaN;
  const m = values.reduce((a, b) => a + b, 0) / values.length;
  const varSum = values.reduce((a, b) => a + (b - m) ** 2, 0) / values.length;
  return Math.sqrt(varSum);
}
