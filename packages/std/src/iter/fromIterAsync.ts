import isAsyncIterable from '../types/isAsyncIterable';
import isIterable from '../types/isIterable';

/**
 * Creates an AsyncIterableIterator from an iterable, async iterable, or iterator-like object.
 *
 * Equivalent to `AsyncIterator.from(O)` proposal.
 *
 * @param {AsyncIterable<T> | Iterable<T> | { next: () => Promise<IteratorResult<T>> | IteratorResult<T> }} iter The source object.
 * @returns {AsyncIterableIterator<T>} A new async iterable iterator.
 *
 * @example
 * const it = fromIterAsync([1, 2, 3]);
 * for await (const x of it) { console.log(x); } //=> 1, 2, 3
 */
export default function fromIterAsync<T>(
  iter:
    | AsyncIterable<T>
    | Iterable<T>
    | { next: () => Promise<IteratorResult<T>> | IteratorResult<T> },
): AsyncIterableIterator<T> {
  if (isAsyncIterable(iter)) {
    const asyncIter = iter[Symbol.asyncIterator]();
    return {
      next() {
        return asyncIter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  if (isIterable(iter)) {
    const syncIter = iter[Symbol.iterator]();
    return {
      async next() {
        return syncIter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  if (
    iter &&
    typeof iter === 'object' &&
    typeof (iter as any).next === 'function'
  ) {
    return {
      async next() {
        return (iter as any).next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  throw new TypeError('The argument must be an iterable or an iterator.');
}
