import isEmpty from '../assert/isEmpty';

/**
 * Returns the maximum value of the given array.
 *
 * @param {T[]} arr The source array.
 * @param {Function} by The iteratee to pick the value.
 * @returns {T|null} The maximum value.
 *
 * @example
 * max([10, 20, 50, 30]) //=> 50
 */
export default function max<T>(
  arr: T[] = [],
  by: (val: T) => number | string = (x: T) => x as unknown as number | string,
): T | null {
  if (isEmpty(arr)) {
    return null;
  }

  let result: T | null = null;
  let maxVal: number | string | null = null;

  for (const item of arr) {
    if (item === null || item === undefined) {
      continue;
    }
    const currentVal = by(item);
    if (maxVal === null || currentVal > maxVal) {
      maxVal = currentVal;
      result = item;
    }
  }

  return result;
}
