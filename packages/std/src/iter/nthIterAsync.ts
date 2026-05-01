/**
 * Returns the nth item (0-indexed) from an async iterable.
 *
 * @param {AsyncIterable<T>} iter The async iterable to search.
 * @param {number} n The index of the item to return.
 * @returns {Promise<T | undefined>} A promise that resolves to the nth item, or undefined.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * await nthIterAsync(gen(), 1) //=> 2
 */
export default async function nthIterAsync<T>(
  iter: AsyncIterable<T>,
  n: number,
): Promise<T | undefined> {
  if (n < 0) return undefined;
  let i = 0;
  for await (const item of iter) {
    if (i === n) return item;
    i++;
  }
  return undefined;
}
