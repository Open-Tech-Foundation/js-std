/**
 * Checks if the given value is an async function.
 *
 * @example
 *
 * isAsyncFunction(async () => {}) //=> true
 *
 * isAsyncFunction(() => {}) //=> false
 *
 */

export default function isAsyncFunction(
  val: unknown,
): val is ((...args: unknown[]) => Promise<unknown>) | AsyncGeneratorFunction {
  const a = ['[object AsyncFunction]', '[object AsyncGeneratorFunction]'];
  return a.includes(Object.prototype.toString.call(val));
}
