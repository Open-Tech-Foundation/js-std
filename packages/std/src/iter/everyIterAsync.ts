/**
 * Checks if all items in an async iterator match a predicate.
 *
 * @param {AsyncIterable<T>} iter The async iterable to check.
 * @param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
 * @returns {Promise<boolean>} A promise that resolves to true if all items match, else false.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * await everyIterAsync(gen(), x => x > 0) //=> true
 */
export default async function everyIterAsync<T>(
  iter: AsyncIterable<T>,
  fn: (val: T) => boolean | Promise<boolean>,
): Promise<boolean> {
  for await (const item of iter) {
    if (!(await fn(item))) {
      return false;
    }
  }
  return true;
}
