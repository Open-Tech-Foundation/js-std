/**
 * Returns a generator that yields items from an iterable as long as a predicate is true.
 *
 * @param {Iterable<T>} iter The iterable to take from.
 * @param {(val: T) => boolean} fn The predicate function.
 * @returns {IterableIterator<T>} A new iterable iterator.
 *
 * @example
 * const it = takeWhileIter([1, 2, 3, 4], x => x < 3);
 * [...it] //=> [1, 2]
 */
export default function* takeWhileIter<T>(
  iter: Iterable<T>,
  fn: (val: T) => boolean,
): IterableIterator<T> {
  for (const item of iter) {
    if (!fn(item)) break;
    yield item;
  }
}
