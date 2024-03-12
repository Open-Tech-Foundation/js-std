import isNum from '../types/isNum';
import isObj from '../types/isObj';

export type OrderType = 'asc' | 'desc';
export type SortCB<T> = (a: T, b: T) => [unknown, unknown];
/**
 * Sorts a list of items and returns a new array.
 *
 * @example
 *
 * sort([1, 3, 2]) // [1, 2, 3]
 * sort(['x', 'z', 'y'], 'desc') // ['z', 'y', 'x']
 */
export default function sort<T>(
  arr: T[] = [],
  order: OrderType = 'asc',
  cb?: SortCB<T>
): T[] {
  const cmpFn = (a: T, b: T) => {
    let x: unknown = a,
      y: unknown = b;

    if (isObj(a) && cb) {
      [x, y] = cb(a, b);
    }

    [x, y] = order === 'asc' ? [x, y] : [y, x];

    if (isNum(x)) {
      return x - (y as number);
    }

    return (x as string) < (y as string)
      ? -1
      : (x as string) > (y as string)
        ? 1
        : 0;
  };

  return arr.toSorted(cmpFn);
}
