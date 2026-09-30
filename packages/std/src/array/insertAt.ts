export interface InsertAtOptions<T> {
  /** Items to insert at the selected index. */
  items: T[];
}

/**
 * Inserts items at the given index into the given array.
 *
 * @param {T[]} arr The source array.
 * @param {number} index The index to insert items at.
 * @param {InsertAtOptions<T>} [options] The items to insert.
 * @returns {T[]} A new array with the inserted items.
 *
 * @example
 * insertAt([1, 2, 3], 1, { items: [5] }); //=> [1, 5, 2, 3]
 * insertAt([1, 2, 3], 0, { items: [5, 6] }); //=> [5, 6, 1, 2, 3]
 */

export default function insertAt<T>(
  arr: T[] = [],
  index: number,
  options?: InsertAtOptions<T>,
): T[] {
  const a = arr.slice();
  a.splice(index, 0, ...(options?.items ?? []));
  return a;
}
