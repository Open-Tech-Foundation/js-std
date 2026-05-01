/**
 * Finds the index of the last item in an iterator that matches a predicate.
 *
 * @param {Iterable<T>} iter The iterable to search.
 * @param {(val: T) => boolean} fn The predicate function.
 * @returns {number} The index of the last matching item, or -1.
 *
 * @example
 * findLastIndexIter([1, 2, 3, 2], x => x === 2) //=> 3
 */
export default function findLastIndexIter<T>(
  iter: Iterable<T>,
  fn: (val: T) => boolean,
): number {
  let lastIndex = -1;
  let i = 0;
  for (const item of iter) {
    if (fn(item)) {
      lastIndex = i;
    }
    i++;
  }
  return lastIndex;
}
