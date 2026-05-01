/**
 * Collects all items from an async iterator into an array.
 *
 * @param {AsyncIterable<T>} iter The async iterable to collect.
 * @returns {Promise<T[]>} A promise that resolves to an array of all items.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * await toArrayIterAsync(gen()) //=> [1, 2]
 */
export default async function toArrayIterAsync<T>(
  iter: AsyncIterable<T>,
): Promise<T[]> {
  const arr: T[] = [];
  for await (const item of iter) {
    arr.push(item);
  }
  return arr;
}
