/**
 * Returns the first item from an async iterable.
 *
 * @param {AsyncIterable<T>} iter The async iterable to search.
 * @returns {Promise<T | undefined>} A promise that resolves to the first item, or undefined.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * await firstIterAsync(gen()) //=> 1
 */
export default async function firstIterAsync<T>(
  iter: AsyncIterable<T>,
): Promise<T | undefined> {
  for await (const item of iter) {
    return item;
  }
  return undefined;
}
