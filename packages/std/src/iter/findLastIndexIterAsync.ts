/**
 * Finds the index of the last item in an async iterator that matches a predicate.
 *
 * @param {AsyncIterable<T>} iter The async iterable to search.
 * @param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
 * @returns {Promise<number>} A promise that resolves to the index of the last matching item, or -1.
 *
 * @example
 * async function* gen() { yield 1; yield 2; yield 3; }
 * await findLastIndexIterAsync(gen(), x => x < 3) //=> 1
 */
export default async function findLastIndexIterAsync<T>(
  iter: AsyncIterable<T>,
  fn: (val: T) => boolean | Promise<boolean>,
): Promise<number> {
  let lastIndex = -1;
  let i = 0;
  for await (const item of iter) {
    if (await fn(item)) {
      lastIndex = i;
    }
    i++;
  }
  return lastIndex;
}
