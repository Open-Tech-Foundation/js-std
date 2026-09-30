/** Options for {@link replace}. */
export interface ReplaceOptions<T> {
  /** The values to insert in place of the selected item. */
  items?: T[];
}

/**
 * Replaces items at the given index or all elements matching the predicate.
 *
 * @param {T[]} arr The source array.
 * @param {number|Function} indexOrFn The index or predicate function.
 * @param {ReplaceOptions} [options] Replacement values.
 * @returns {T[]} A new array with the replaced items.
 *
 * @example
 * replace([1, 2, 3], 1, { items: [5] }); //=> [1, 5, 3]
 * replace([1, 2, 3, 4, 5], (x) => x % 2 === 0, { items: [0] }); //=> [1, 0, 3, 0, 5]
 */
export default function replace<T>(
  arr: T[] = [],
  indexOrFn: number | null | ((item: T, index: number, array: T[]) => boolean),
  { items = [] }: ReplaceOptions<T> = {},
): T[] {
  const a = arr.slice();

  if (typeof indexOrFn === 'function') {
    return a.map((item, index, array) =>
      (indexOrFn as (item: T, index: number, array: T[]) => boolean)(
        item,
        index,
        array,
      )
        ? items.length > 0
          ? items[0]
          : item
        : item,
    );
  }

  const idx = indexOrFn ?? arr.length - 1;
  a.splice(idx, 1, ...items);
  return a;
}
