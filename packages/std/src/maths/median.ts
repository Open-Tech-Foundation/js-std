import isEven from './isEven';

/**
 * Calculates the median value of the given array.
 *
 * @example
 *
 * median([4, 2, 8]) //=> 4
 */

export default function median<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number,
): number {
  if (arr.length === 0) {
    return Number.NaN;
  }
  const sorted = (arr as unknown[])
    .map((v, i) => (cb ? cb(v as T, i) : (v as number)))
    .sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (isEven(sorted.length)) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}
