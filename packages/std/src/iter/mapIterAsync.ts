/**
 * Transforms each item in an async iterator using a mapper function.
 *
 * @param {AsyncIterable<T>} iter The async iterable to transform.
 * @param {(val: T) => U | Promise<U>} fn The mapper function.
 * @returns {AsyncIterableIterator<U>} A new async iterable iterator.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * const doubled = mapIterAsync(gen(), x => x * 2);
 * for await (const x of doubled) { console.log(x); } //=> 2, 4
 */
export default async function* mapIterAsync<T, U>(
  iter: AsyncIterable<T>,
  fn: (val: T) => U | Promise<U>,
): AsyncIterableIterator<U> {
  for await (const item of iter) {
    yield await fn(item);
  }
}
