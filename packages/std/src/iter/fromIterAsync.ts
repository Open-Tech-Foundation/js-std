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
      return(value?: unknown) {
        if (typeof asyncIter.return === 'function') {
          return asyncIter.return(value as never);
        }
        return Promise.resolve({ value, done: true } as IteratorResult<T>);
      },
      throw(error?: unknown) {
        if (typeof asyncIter.throw === 'function') {
          return asyncIter.throw(error);
        }
        return Promise.reject(error);
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
      async return(value?: unknown) {
        if (typeof syncIter.return === 'function') {
          return syncIter.return(value as never);
        }
        return { value, done: true } as IteratorResult<T>;
      },
      async throw(error?: unknown) {
        if (typeof syncIter.throw === 'function') {
          return syncIter.throw(error);
        }
        throw error;
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
      async return(value?: unknown) {
        if (typeof (iter as any).return === 'function') {
          return (iter as any).return(value);
        }
        return { value, done: true } as IteratorResult<T>;
      },
      async throw(error?: unknown) {
        if (typeof (iter as any).throw === 'function') {
          return (iter as any).throw(error);
        }
        throw error;
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  throw new TypeError('The argument must be an iterable or an iterator.');
}
