/**
 * Replaces items at the given index from the given array.
 *
 * @param {T[]} arr The source array.
 * @param {number} index The index to replace items at.
 * @param {number} deleteCount The number of items to delete.
 * @param {T[]} replacements The items to replace with.
 * @returns {T[]} A new array with the replaced items.
 *
 * @example
 * arrayReplace([1, 2, 3], 1, 1, 5); //=> [1, 5, 3]
 */
export default function arrayReplace<T>(
  arr: T[] = [],
  index: number | null = null,
  deleteCount: number | null = null,
  ...replacements: T[]
): T[] {
  const idx = index ?? arr.length - 1;
  const a = arr.slice();

  a.splice(idx, deleteCount ?? replacements.length, ...replacements);

  return a;
}
