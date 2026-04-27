/**
 * Swaps two elements in an array at the given indices.
 *
 * @param {T[]} arr The source array.
 * @param {number} x The index of the first element.
 * @param {number} y The index of the second element.
 * @returns {T[]} A new array with swapped elements.
 *
 * @example
 * swap([1, 2, 3, 4, 5], 0, 1) //=> [2, 1, 3, 4, 5]
 */
export default function swap<T>(arr: T[], x: number, y: number): T[] {
  if (arr.length === 0) {
    return [];
  }

  const a = arr.slice();
  const b = a[y];

  a[y] = a[x];
  a[x] = b;

  return a;
}
