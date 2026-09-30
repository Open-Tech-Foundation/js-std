export interface ReplaceAtOptions<T> {
  /** Items to replace the item at the selected index. */
  items: T[];
}

/**
 * Replaces items at the given index in the given array.
 *
 * @param {T[]} arr The source array.
 * @param {number} index The index to replace items at.
 * @param {ReplaceAtOptions<T>} [options] The items to replace with.
 * @returns {T[]} A new array with the replaced items.
 *
 * @example
 * replaceAt([1, 2, 3], 1, { items: [5] }); //=> [1, 5, 3]
 * replaceAt([1, 2, 3], 1, { items: [5, 6] }); //=> [1, 5, 6, 3]
 */

export default function replaceAt<T>(
  arr: T[] = [],
  index: number,
  options?: ReplaceAtOptions<T>,
): T[] {
  const a = arr.slice();
  a.splice(index, 1, ...(options?.items ?? []));
  return a;
}
