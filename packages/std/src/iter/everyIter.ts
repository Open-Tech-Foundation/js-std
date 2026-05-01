/**
 * Checks if all items in an iterator match a predicate.
 *
 * @param {Iterable<T>} iter The iterable to check.
 * @param {(val: T) => boolean} fn The predicate function.
 * @returns {boolean} True if all items match, else false.
 *
 * @example
 * everyIter([1, 2, 3], x => x > 0) //=> true
 */
export default function everyIter<T>(
  iter: Iterable<T>,
  fn: (val: T) => boolean,
): boolean {
  for (const item of iter) {
    if (!fn(item)) {
      return false;
    }
  }
  return true;
}
