import isIterable from '../types/isIterable';

/**
 * Converts a sync iterable to an async iterable.
 *
 * Equivalent to `Iterator.prototype.toAsync()` proposal.
 *
 * @param {Iterable<T>} iter The sync iterable to convert.
 * @returns {AsyncIterableIterator<T>} A new async iterable iterator.
 *
 * @example
 * const asyncIter = toAsyncIter([1, 2, 3]);
 * for await (const x of asyncIter) { console.log(x); } //=> 1, 2, 3
 */
export default async function* toAsyncIter<T>(
  iter: Iterable<T>,
): AsyncIterableIterator<T> {
  if (!isIterable(iter)) {
    throw new TypeError('The argument must be an iterable.');
  }

  for (const item of iter) {
    yield item;
  }
}
