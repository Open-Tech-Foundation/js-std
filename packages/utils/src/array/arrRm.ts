/**
 *  Removes items at the given index from the given array.
 *
 * @example
 *
 * arrRm([1, 2, 3], 1, 2); // [1]
 */
export default function arrRm(
  arr: unknown[] = [],
  index?: number,
  count: number = 1
) {
  const idx = index ?? arr.length - 1;
  const a = [...arr];

  a.splice(idx, count);

  return a;
}
