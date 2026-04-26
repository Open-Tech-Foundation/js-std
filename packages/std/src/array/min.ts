import isEmpty from '../assert/isEmpty';

/**
 * Returns the minimum value of the given array.
 *
 * @example
 *
 * min([10, 20, 50, 30]) //=> 10
 */
export default function min<T>(
  arr: T[] = [],
  by: (val: T) => number | string = (x: T) => x as unknown as number | string,
): T | null {
  if (isEmpty(arr)) {
    return null;
  }

  let result: T | null = null;
  let minVal: number | string | null = null;

  for (const item of arr) {
    if (item === null || item === undefined) {
      continue;
    }
    const currentVal = by(item);
    if (minVal === null || currentVal < minVal) {
      minVal = currentVal;
      result = item;
    }
  }

  return result;
}
