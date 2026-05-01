/**
 * Filters items in an async iterator based on a predicate.
 *
 * @param {AsyncIterable<T>} iter The async iterable to filter.
 * @param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
 * @returns {AsyncIterableIterator<T>} A new async iterable iterator.
 *
 * @example
 * async function* gen() { yield 1; yield 2; yield 3; }
 * const evens = filterIterAsync(gen(), x => x % 2 === 0);
 * for await (const x of evens) { console.log(x); } //=> 2
 */
export default async function* filterIterAsync<T>(
  iter: AsyncIterable<T>,
  fn: (val: T) => boolean | Promise<boolean>,
): AsyncIterableIterator<T> {
  for await (const item of iter) {
    if (await fn(item)) {
      yield item;
    }
  }
}
