/**
 * Accumulates values from an async iterator using a reducer function.
 *
 * @param {AsyncIterable<T>} iter The async iterable to reduce.
 * @param {(acc: U, val: T) => U | Promise<U>} fn The reducer function.
 * @param {U} initialValue The initial value for the accumulator.
 * @returns {Promise<U>} A promise that resolves to the final accumulator value.
 *
 * @example
 * async function* gen() { yield 1; yield 2; yield 3; }
 * await reduceIterAsync(gen(), (acc, x) => acc + x, 0) //=> 6
 */
export default async function reduceIterAsync<T, U>(
  iter: AsyncIterable<T>,
  fn: (acc: U, val: T) => U | Promise<U>,
  initialValue: U,
): Promise<U> {
  let acc = initialValue;
  for await (const item of iter) {
    acc = await fn(acc, item);
  }
  return acc;
}
