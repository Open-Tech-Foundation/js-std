/**
 * Inserts items at the given index or before/after the first element matching the predicate.
 *
 * @param {T[]} arr The source array.
 * @param {number|Function} indexOrFn The index or predicate function.
 * @param {T[]} items The items to insert.
 * @param {string} position Insert before or after the match (default 'before').
 * @returns {T[]} A new array with the inserted items.
 *
 * @example
 * insert([1, 2, 3], 1, 5); //=> [1, 5, 2, 3]
 * insert([1, 2, 3], (x) => x === 2, 5); //=> [1, 5, 2, 3]
 * insert([1, 2, 3], (x) => x === 2, 5, 'after'); //=> [1, 2, 5, 3]
 */
export default function insert<T>(
  arr: T[] = [],
  indexOrFn: number | null | undefined | ((item: T, index: number, array: T[]) => boolean),
  ...items: T[]
): T[] {
  const a = arr.slice();
  let idx: number;

  if (typeof indexOrFn === 'function') {
    const position = items[items.length - 1] === 'before' || items[items.length - 1] === 'after' ? items.pop() : 'before';
    const fn = indexOrFn as (item: T, index: number, array: T[]) => boolean;
    const index = a.findIndex(fn);
    if (index === -1) return a;
    idx = position === 'after' ? index + 1 : index;
  } else {
    idx = indexOrFn ?? arr.length;
  }

  a.splice(idx, 0, ...items);
  return a;
}
