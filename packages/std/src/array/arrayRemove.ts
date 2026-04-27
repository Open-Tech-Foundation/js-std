/**
 * Removes items at the given index from the given array.
 *
 * @param {T[]} arr The source array.
 * @param {number} index The index to remove items from.
 * @param {number} count The number of items to remove.
 * @returns {T[]} A new array with the removed items.
 *
 * @example
 * arrayRemove([1, 2, 3], 1, 2); //=> [1]
 */
export default function arrayRemove<T>(
  arr: T[] = [],
  index?: number,
  count = 1,
): T[] {
  const idx = index ?? arr.length - 1;
  const a = [...arr];

  a.splice(idx, count);

  return a;
}
