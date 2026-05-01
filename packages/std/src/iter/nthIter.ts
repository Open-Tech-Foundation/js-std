/**
 * Returns the nth item (0-indexed) from an iterable.
 *
 * @param {Iterable<T>} iter The iterable to search.
 * @param {number} n The index of the item to return.
 * @returns {T | undefined} The nth item, or undefined.
 *
 * @example
 * nthIter([1, 2, 3], 1) //=> 2
 */
export default function nthIter<T>(
  iter: Iterable<T>,
  n: number,
): T | undefined {
  if (n < 0) return undefined;
  let i = 0;
  for (const item of iter) {
    if (i === n) return item;
    i++;
  }
  return undefined;
}
