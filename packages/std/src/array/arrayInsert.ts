/**
 * Inserts items at the given index into the given array.
 *
 * @param {T[]} arr The source array.
 * @param {number} index The index to insert items at.
 * @param {T[]} items The items to insert.
 * @returns {T[]} A new array with the inserted items.
 *
 * @example
 * arrayInsert([1, 2, 3], 1, 5); //=> [1, 5, 2, 3]
 */
export default function arrayInsert<T>(
  arr: T[] = [],
  index: number | null | undefined,
  ...items: T[]
): T[] {
  const idx = index ?? arr.length;
  const a = arr.slice();
  a.splice(idx, 0, ...items);
  return a;
}
