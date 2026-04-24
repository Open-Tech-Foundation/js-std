/**
 * Checks if the given value is an async function.
 *
 * @example
 *
 * isAsyFn(async () => {}) //=> true
 *
 * isAsyFn(() => {}) //=> false
 *
 */

export default function isAsyFn(
  val: unknown,
): val is ((...args: unknown[]) => Promise<unknown>) | AsyncGeneratorFunction {
  const a = ['[object AsyncFunction]', '[object AsyncGeneratorFunction]'];
  return a.includes(Object.prototype.toString.call(val));
}
