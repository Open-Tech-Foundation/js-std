/**
 * Returns the first item from an iterable.
 *
 * @param {Iterable<T>} iter The iterable to get the first item from.
 * @returns {T | undefined} The first item, or undefined.
 *
 * @example
 * firstIter([1, 2, 3]) //=> 1
 */
export default function firstIter<T>(iter: Iterable<T>): T | undefined {
  for (const item of iter) {
    return item;
  }
  return undefined;
}
