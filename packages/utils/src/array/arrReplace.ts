/**
 *  Replaces items at the given index from the given array.
 *
 * @example
 *
 * arrReplace([1, 2, 3], 1, 5); // [1, 5, 3]
 */
export default function arrReplace(
  arr: unknown[] = [],
  index?: number | null,
  ...replacements: unknown[]
) {
  const idx = index ?? arr.length - 1;
  const a = [...arr];

  a.splice(idx, replacements.length, ...replacements);

  return a;
}
