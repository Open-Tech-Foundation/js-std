export type OrderType = 'asc' | 'desc';
/**
 * Sorts a list of items and returns a new array.
 *
 * @example
 *
 * sort([1, 3, 2]) // [1, 2, 3]
 * sort(['x', 'z', 'y'], 'desc') // ['z', 'y', 'x']
 */
export default function sort<T>(arr: T[] = [], order: OrderType = 'asc'): T[] {
  return [...arr].sort((a: T, b: T) => {
    const val = a < b ? -1 : a > b ? 1 : 0;

    return order === 'asc' ? val : -val;
  });
}
