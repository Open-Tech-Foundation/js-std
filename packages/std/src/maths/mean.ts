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
  if (arr.length === 0) {
    return Number.NaN;
  }
  const sum = (arr as unknown[]).reduce((prev: number, cur, i) => {
    return prev + (cb ? cb(cur as T, i) : (cur as number));
  }, 0);
  return sum / arr.length;
}
