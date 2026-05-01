/**
 * Finds the first item in an async iterator that matches a predicate.
 *
 * @param {AsyncIterable<T>} iter The async iterable to search.
 * @param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
 * @returns {Promise<T | undefined>} A promise that resolves to the first matching item, or undefined.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * await findIterAsync(gen(), x => x > 1) //=> 2
 */
export default async function findIterAsync<T>(
  iter: AsyncIterable<T>,
  fn: (val: T) => boolean | Promise<boolean>,
): Promise<T | undefined> {
  for await (const item of iter) {
    if (await fn(item)) {
      return item;
    }
  }
  return undefined;
}
