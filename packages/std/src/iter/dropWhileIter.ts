/**
 * Returns a generator that skips items from an iterable as long as a predicate is true, then yields the rest.
 *
 * @param {Iterable<T>} iter The iterable to drop from.
 * @param {(val: T) => boolean} fn The predicate function.
 * @returns {IterableIterator<T>} A new iterable iterator.
 *
 * @example
 * const it = dropWhileIter([1, 2, 3, 4], x => x < 3);
 * [...it] //=> [3, 4]
 */
export default function* dropWhileIter<T>(
  iter: Iterable<T>,
  fn: (val: T) => boolean,
): IterableIterator<T> {
  let drop = true;
  for (const item of iter) {
    if (drop && fn(item)) {
      continue;
    }
    drop = false;
    yield item;
  }
}
