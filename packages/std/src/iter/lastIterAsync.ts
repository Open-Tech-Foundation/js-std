/**
 * Returns the last item from an async iterable.
 *
 * @param {AsyncIterable<T>} iter The async iterable to search.
 * @returns {Promise<T | undefined>} A promise that resolves to the last item, or undefined.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * await lastIterAsync(gen()) //=> 2
 */
export default async function lastIterAsync<T>(
  iter: AsyncIterable<T>,
): Promise<T | undefined> {
  let last: T | undefined = undefined;
  for await (const item of iter) {
    last = item;
  }
  return last;
}
