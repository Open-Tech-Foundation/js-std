/** Values and predicate position for {@link insert}. */
export interface InsertOptions<T> {
  /** Values to insert. */
  items: T[];
  /** Insert relative to a predicate match. Defaults to `before`. */
  position?: 'before' | 'after';
}

/**
 * Inserts items at the given index or before/after the first element matching the predicate.
 *
 * @param {T[]} arr The source array.
 * @param {number|Function} indexOrFn The index or predicate function.
 * @param {InsertOptions<T>} options The items to insert and optional predicate position.
 * @returns {T[]} A new array with the inserted items.
 *
 * @example
 * insert([1, 2, 3], 1, { items: [5] }); //=> [1, 5, 2, 3]
 * insert([1, 2, 3], (x) => x === 2, { items: [5] }); //=> [1, 5, 2, 3]
 * insert([1, 2, 3], (x) => x === 2, { items: [5], position: 'after' }); //=> [1, 2, 5, 3]
 */
export default function insert<T>(
  arr: T[] = [],
  indexOrFn:
    | number
    | null
    | undefined
    | ((item: T, index: number, array: T[]) => boolean),
  options?: InsertOptions<T>,
): T[] {
  const a = arr.slice();
  const items = options?.items ?? [];
  let idx: number;

  if (typeof indexOrFn === 'function') {
    const index = a.findIndex(indexOrFn);
    if (index === -1) return a;
    idx = options?.position === 'after' ? index + 1 : index;
  } else {
    idx = indexOrFn ?? arr.length;
  }

  a.splice(idx, 0, ...items);
  return a;
}
