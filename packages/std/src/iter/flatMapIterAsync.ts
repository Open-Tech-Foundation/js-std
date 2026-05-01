import isArray from '../types/isArray';

/**
 * Maps each item in an async iterator and flattens the result.
 *
 * @param {AsyncIterable<T>} iter The async iterable to transform.
 * @param {(val: T) => AsyncIterable<U> | Iterable<U> | Promise<AsyncIterable<U> | Iterable<U>>} fn The mapper function.
 * @returns {AsyncIterableIterator<U>} A new async iterable iterator.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * const flattened = flatMapIterAsync(gen(), x => [x, x * 10]);
 * for await (const x of flattened) { console.log(x); } //=> 1, 10, 2, 20
 */
export default async function* flatMapIterAsync<T, U>(
  iter: AsyncIterable<T>,
  fn: (
    val: T,
  ) => AsyncIterable<U> | Iterable<U> | Promise<AsyncIterable<U> | Iterable<U>>,
): AsyncIterableIterator<U> {
  for await (const item of iter) {
    const result = await fn(item);
    if (
      result &&
      (typeof (result as any)[Symbol.asyncIterator] === 'function' ||
        typeof (result as any)[Symbol.iterator] === 'function')
    ) {
      for await (const subItem of result as AsyncIterable<U>) {
        yield subItem;
      }
    } else if (isArray(result)) {
      for (const subItem of result as U[]) {
        yield subItem;
      }
    }
  }
}
