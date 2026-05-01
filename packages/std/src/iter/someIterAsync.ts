/**
 * Checks if any item in an async iterator matches a predicate.
 *
 * @param {AsyncIterable<T>} iter The async iterable to check.
 * @param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
 * @returns {Promise<boolean>} A promise that resolves to true if any item matches, else false.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * await someIterAsync(gen(), x => x > 1) //=> true
 */
export default async function someIterAsync<T>(
  iter: AsyncIterable<T>,
  fn: (val: T) => boolean | Promise<boolean>,
): Promise<boolean> {
  for await (const item of iter) {
    if (await fn(item)) {
      return true;
    }
  }
  return false;
}
