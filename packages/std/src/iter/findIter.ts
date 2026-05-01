/**
 * Finds the first item in an iterator that matches a predicate.
 *
 * @param {Iterable<T>} iter The iterable to search.
 * @param {(val: T) => boolean} fn The predicate function.
 * @returns {T | undefined} The first matching item, or undefined.
 *
 * @example
 * findIter([1, 2, 3], x => x > 1) //=> 2
 */
export default function findIter<T>(
  iter: Iterable<T>,
  fn: (val: T) => boolean,
): T | undefined {
  for (const item of iter) {
    if (fn(item)) {
      return item;
    }
  }
  return undefined;
}
