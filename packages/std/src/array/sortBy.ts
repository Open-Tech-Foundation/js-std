import type { OrderType } from './sort';

export type SortCB<T> = (val: T) => number | string | boolean | Date;
export type OrderTuples<T> = [keyof T | SortCB<T>, OrderType][];

/** Options for {@link sortBy}. */
export interface SortByOptions<T> {
  /** The keys or callbacks and sort direction to apply, in priority order. */
  criteria?: OrderTuples<T>;
}

/**
 * Sorts an array of objects by one or more criteria.
 *
 * @param {T[]} arr The source array.
 * @param {SortByOptions} [options] The criteria to sort by.
 * @returns {T[]} A new sorted array.
 *
 * @example
 * const arr = [{a: 1}, {a: 3}, {a: 2}]
 * sortBy(arr, { criteria: [['a', 'asc']] }); //=> [{a: 1}, {a: 2}, {a: 3}]
 */
export default function sortBy<T>(
  arr: T[],
  { criteria = [] }: SortByOptions<T> = {},
): T[] {
  return [...arr].sort((a: T, b: T) => {
    for (let i = 0; i < criteria.length; i++) {
      const [key, order] = criteria[i];
      const x = typeof key === 'function' ? (key as SortCB<T>)(a) : a[key];
      const y = typeof key === 'function' ? (key as SortCB<T>)(b) : b[key];

      if (x !== y) {
        const val = x < y ? -1 : 1;

        return order === 'asc' ? val : -val;
      }
    }

    return 0;
  });
}
