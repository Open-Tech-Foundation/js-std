/**
 * Finds the last item in an iterator that matches a predicate.
 *
 * @param {Iterable<T>} iter The iterable to search.
 * @param {(val: T) => boolean} fn The predicate function.
 * @returns {T | undefined} The last matching item, or undefined.
 *
 * @example
 * findLastIter([1, 2, 3, 2], x => x === 2) //=> 2 (the second one)
 */
export default function findLastIter<T>(
  iter: Iterable<T>,
  fn: (val: T) => boolean,
): T | undefined {
  let last: T | undefined = undefined;
  for (const item of iter) {
    if (fn(item)) {
      last = item;
    }
  }
  return last;
}
