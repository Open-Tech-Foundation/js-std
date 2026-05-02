/**
 * Replaces items at the given index in the given array.
 *
 * @param {T[]} arr The source array.
 * @param {number} index The index to replace items at.
 * @param {T[]} items The items to replace with.
 * @returns {T[]} A new array with the replaced items.
 *
 * @example
 * replaceAt([1, 2, 3], 1, 5); //=> [1, 5, 3]
 * replaceAt([1, 2, 3], 1, 5, 6); //=> [1, 5, 6, 3]
 */

export default function replaceAt<T>(
  arr: T[] = [],
  index: number,
  ...items: T[]
): T[] {
  const a = arr.slice();
  a.splice(index, 1, ...items);
  return a;
}
