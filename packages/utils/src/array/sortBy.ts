import isStr from '../types/isStr';
import { OrderType } from './sort';

export type SortCB<T> = (val: T) => number | string | boolean | Date;
export type OrderTuples<T> = [keyof T | SortCB<T>, OrderType][];

/**
 * Sorts a list of objects and returns a new array.
 *
 * @example
 *
 * const arr = [{a: 1}, {a: 3}, {a: 2}]
 * sortBy(arr, ['a', 'asc']); //=> [{a: 1}, {a: 2}, {a: 3}]
 */
export default function sortBy<T>(arr: T[], ...tuples: OrderTuples<T>): T[] {
  return [...arr].sort((a: T, b: T) => {
    for (let i = 0; i < tuples.length; i++) {
      const [key, order] = tuples[i];
      const x = isStr(key) ? a[key] : (key as SortCB<T>)(a);
      const y = isStr(key) ? b[key] : (key as SortCB<T>)(b);

      if (x !== y) {
        const val = x < y ? -1 : 1;

        return order === 'asc' ? val : -val;
      }
    }

    return 0;
  });
}
