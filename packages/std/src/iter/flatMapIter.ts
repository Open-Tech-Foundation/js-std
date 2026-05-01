/**
 * Maps each item in an iterator and flattens the result.
 *
 * @param {Iterable<T>} iter The iterable to transform.
 * @param {(val: T) => Iterable<U>} fn The mapper function returning iterables.
 * @returns {IterableIterator<U>} A new iterable iterator.
 *
 * @example
 * const flattened = flatMapIter([1, 2], x => [x, x * 10]);
 * [...flattened] //=> [1, 10, 2, 20]
 */
export default function* flatMapIter<T, U>(
  iter: Iterable<T>,
  fn: (val: T) => Iterable<U>,
): IterableIterator<U> {
  for (const item of iter) {
    for (const subItem of fn(item)) {
      yield subItem;
    }
  }
}
