/**
 * Finds the index of the first item in an async iterator that matches a predicate.
 *
 * @param {AsyncIterable<T>} iter The async iterable to search.
 * @param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
 * @returns {Promise<number>} A promise that resolves to the index of the first matching item, or -1.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * await findIndexIterAsync(gen(), x => x === 2) //=> 1
 */
export default async function findIndexIterAsync<T>(
  iter: AsyncIterable<T>,
  fn: (val: T) => boolean | Promise<boolean>,
): Promise<number> {
  let i = 0;
  for await (const item of iter) {
    if (await fn(item)) {
      return i;
    }
    i++;
  }
  return -1;
}
