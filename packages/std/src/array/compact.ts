import isArray from '../types/isArray';

/**
 * Removes all the falsy values in the given array.
 *
 * @param {T[]} arr The source array.
 * @returns {T[]} A new array without falsy values.
 *
 * @example
 * compact([1, null, 2, 0, 3]) //=> [1, 2, 3]
 */
export default function compact<T>(arr: T[] = []): T[] {
  if (!isArray(arr)) {
    return [];
  }

  const falsy = [undefined, null, false, 0, ''];

  return arr.filter((val) => {
    if (Number.isNaN(val)) {
      return false;
    }
    return !falsy.includes(val as any);
  });
}
