import isEmpty from '../assert/isEmpty';

/**
 * Returns the minimum and maximum values of the given array.
 *
 * @example
 *
 * bounds([10, 20, 50, 30]) //=> [10, 50]
 */
export default function bounds<T>(
  arr: T[] = [],
  by: (val: T) => number | string = (x: T) => x as unknown as number | string,
): [T, T] | null {
  if (isEmpty(arr)) {
    return null;
  }

  let minRes: T | null = null;
  let maxRes: T | null = null;
  let minVal: number | string | null = null;
  let maxVal: number | string | null = null;

  for (const item of arr) {
    if (item === null || item === undefined) {
      continue;
    }
    const currentVal = by(item);
    if (minVal === null || currentVal < minVal) {
      minVal = currentVal;
      minRes = item;
    }
    if (maxVal === null || currentVal > maxVal) {
      maxVal = currentVal;
      maxRes = item;
    }
  }

  if (minRes === null || maxRes === null) {
    return null;
  }

  return [minRes, maxRes];
}
