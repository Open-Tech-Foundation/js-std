import collectPresentValues from './collectPresentValues';
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
  const sorted = collectPresentValues(arr, cb).sort((a, b) => a - b);

  if (sorted.length === 0) {
    return Number.NaN;
  }
  const mid = Math.floor(sorted.length / 2);
  if (isEven(sorted.length)) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}
