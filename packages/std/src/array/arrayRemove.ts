/**
 *  Removes items at the given index from the given array.
 *
 * @example
 *
 * arrayRemove([1, 2, 3], 1, 2); // [1]
 */
export default function arrayRemove<T>(
  arr: T[] = [],
  index?: number,
  count = 1,
): T[] {
  const idx = index ?? arr.length - 1;
  const a = [...arr];

  a.splice(idx, count);

  return a;
}
