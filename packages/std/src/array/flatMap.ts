import isArray from '../types/isArray';

/**
 * Maps each item and flattens the result into a single array.
 *
 * @param {T[]} arr The source array.
 * @param {Function} fn The mapper function returning arrays.
 * @returns {U[]} A new flattened array.
 *
 * @example
 * flatMap([1, 2], (x) => [x, x * 10]) //=> [1, 10, 2, 20]
 */
export default function flatMap<T, U>(
  arr: T[] = [],
  fn: (val: T, index: number, arr: T[]) => U[] | Iterable<U>,
): U[] {
  if (!isArray(arr)) {
    return [];
  }

  const result: U[] = [];

  for (let i = 0; i < arr.length; i++) {
    const mapped = fn(arr[i], i, arr);
    for (const item of mapped) {
      result.push(item);
    }
  }

  return result;
}
