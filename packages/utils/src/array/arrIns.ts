/**
 *  Inserts items at the given index into the given array.
 *
 * @example
 *
 * arrIns([1, 2, 3], 1, 5); // [1, 5, 2, 3]
 */
export default function arrIns(
  arr: unknown[] = [],
  index: number | null | undefined,
  ...items: unknown[]
) {
  const idx = index ?? arr.length;
  const a = [...arr];
  a.splice(idx, 0, ...items);
  return a;
}
