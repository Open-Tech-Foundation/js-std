import sort, { OrderType } from './sort';

export type OrderTuples<T> = [keyof T, OrderType][];

/**
 * Sorts a list of objects and returns a new array.
 *
 * @example
 *
 * const arr = [{a: 1}, {a: 3}, {a: 2}]
 * sortObj(arr, ['a', 'asc']); //=> [{a: 1}, {a: 2}, {a: 3}]
 */
export default function sortObj<T>(
  arr: T[],
  ...orderTyples: OrderTuples<T>
): T[] {
  let out = arr;

  orderTyples.forEach((val) => {
    out = sort(out, val[1], (a, b) => {
      return [a[val[0]], b[val[0]]];
    });
  });

  return out;
}
