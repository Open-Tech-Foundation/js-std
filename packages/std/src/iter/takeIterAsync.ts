/**
 * Returns an AsyncGenerator that yields the first n items from an AsyncIterable.
 *
 * @param {AsyncIterable} iterable The source async iterable.
 * @param {number} n The number of items to take.
 * @returns {AsyncGenerator} A new async generator with the first n items.
 *
 * @example
 * const it = takeIterAsync(asyncIterable, 2);
 * for await (const item of it) { ... }
 */
export default async function* takeIterAsync<T>(
  iterable: AsyncIterable<T>,
  n: number,
): AsyncGenerator<T> {
  let count = 0;
  for await (const item of iterable) {
    if (count >= n) break;
    yield item;
    count++;
  }
}
