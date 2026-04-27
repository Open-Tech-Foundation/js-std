import isEmpty from '../assert/isEmpty';

/**
 * Returns the minimum value of the given array.
 *
 * @param {T[]} arr The source array.
 * @param {Function} by The iteratee to pick the value.
 * @returns {T|null} The minimum value.
 *
 * @example
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
