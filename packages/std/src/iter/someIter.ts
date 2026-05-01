/**
 * Checks if any item in an iterator matches a predicate.
 *
 * @param {Iterable<T>} iter The iterable to check.
 * @param {(val: T) => boolean} fn The predicate function.
 * @returns {boolean} True if any item matches, else false.
 *
 * @example
 * someIter([1, 2, 3], x => x > 1) //=> true
 */
export default function someIter<T>(
  iter: Iterable<T>,
  fn: (val: T) => boolean,
): boolean {
  for (const item of iter) {
    if (fn(item)) {
      return true;
    }
  }
  return false;
}
