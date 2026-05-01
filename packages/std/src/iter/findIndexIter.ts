/**
 * Finds the index of the first item in an iterator that matches a predicate.
 *
 * @param {Iterable<T>} iter The iterable to search.
 * @param {(val: T) => boolean} fn The predicate function.
 * @returns {number} The index of the first matching item, or -1.
 *
 * @example
 * findIndexIter([1, 2, 3], x => x === 2) //=> 1
 */
export default function findIndexIter<T>(
  iter: Iterable<T>,
  fn: (val: T) => boolean,
): number {
  let i = 0;
  for (const item of iter) {
    if (fn(item)) {
      return i;
    }
    i++;
  }
  return -1;
}
