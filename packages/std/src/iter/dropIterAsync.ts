/**
 * Returns an AsyncGenerator that skips the first n items from an AsyncIterable.
 *
 * @param {AsyncIterable} iterable The source async iterable.
 * @param {number} n The number of items to skip.
 * @returns {AsyncGenerator} A new async generator with the remaining items.
 *
 * @example
 * const it = dropIterAsync(asyncIterable, 1);
 * for await (const item of it) { ... }
 */
export default async function* dropIterAsync<T>(
  iterable: AsyncIterable<T>,
  n: number,
): AsyncGenerator<T> {
  let count = 0;
  for await (const item of iterable) {
    if (count < n) {
      count++;
      continue;
    }
    yield item;
  }
}
