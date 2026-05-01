/**
 * Creates an array of grouped elements, the first of which contains the first elements of the given arrays,
 * the second of which contains the second elements of the given arrays, and so on.
 *
 * @param {T[][]} arrays The arrays to zip.
 * @returns {T[][]} A new zipped array.
 *
 * @example
 * zip([1, 2], ['a', 'b']) //=> [[1, 'a'], [2, 'b']]
 * zip([1, 2, 3], ['a', 'b']) //=> [[1, 'a'], [2, 'b'], [3, undefined]]
 */
export default function zip<T>(...arrays: T[][]): T[][] {
  if (arrays.length === 0) {
    return [];
  }

  const maxLen = Math.max(...arrays.map((a) => a.length));
  const result: T[][] = [];

  for (let i = 0; i < maxLen; i++) {
    result.push(arrays.map((a) => a[i]));
  }

  return result;
}
