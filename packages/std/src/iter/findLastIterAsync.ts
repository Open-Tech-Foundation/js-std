/**
 * Finds the last item in an async iterator that matches a predicate.
 *
 * @param {AsyncIterable<T>} iter The async iterable to search.
 * @param {(val: T) => boolean | Promise<boolean>} fn The predicate function.
 * @returns {Promise<T | undefined>} A promise that resolves to the last matching item, or undefined.
 *
 * @example
 * async function* gen() { yield 1; yield 2; yield 3; }
 * await findLastIterAsync(gen(), x => x < 3) //=> 2
 */
export default async function findLastIterAsync<T>(
  iter: AsyncIterable<T>,
  fn: (val: T) => boolean | Promise<boolean>,
): Promise<T | undefined> {
  let last: T | undefined = undefined;
  for await (const item of iter) {
    if (await fn(item)) {
      last = item;
    }
  }
  return last;
}
