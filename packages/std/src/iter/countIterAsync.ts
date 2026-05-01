/**
 * Returns the total count of items in an async iterable.
 *
 * @param {AsyncIterable<unknown>} iter The async iterable to count.
 * @returns {Promise<number>} A promise that resolves to the total count of items.
 *
 * @example
 * async function* gen() { yield 1; yield 2; }
 * await countIterAsync(gen()) //=> 2
 */
export default async function countIterAsync(
  iter: AsyncIterable<unknown>,
): Promise<number> {
  let count = 0;
  for await (const _ of iter) {
    count++;
  }
  return count;
}
