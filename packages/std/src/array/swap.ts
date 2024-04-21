/**
 * Swaps two elements in an array.
 *
 * @example
 * swap([1, 2, 3, 4, 5], 0, 1) //=> [2, 1, 3, 4, 5]
 */
export default function swap<T>(arr: T[], x: number, y: number): T[] {
  const a = [...arr];
  const b = a[y];

  a[y] = a[x];
  a[x] = b;

  return a;
}
