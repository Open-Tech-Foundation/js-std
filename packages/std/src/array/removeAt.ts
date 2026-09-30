/** The number of array items to remove. */
export interface RemoveAtOptions {
  /** The number of items to remove. Defaults to `1`. */
  count?: number;
}

/**
 * Removes items at the given index from the given array.
 *
 * @param {T[]} arr The source array.
 * @param {number} index The index to remove items from.
 * @param {RemoveAtOptions} options The number of items to remove.
 * @returns {T[]} A new array with the removed items.
 *
 * @example
 * removeAt([1, 2, 3], 1); //=> [1, 3]
 * removeAt([1, 2, 3, 4], 1, { count: 2 }); //=> [1, 4]
 */

export default function removeAt<T>(
  arr: T[] = [],
  index: number,
  options?: RemoveAtOptions,
): T[] {
  const a = [...arr];
  a.splice(index, options?.count ?? 1);
  return a;
}
