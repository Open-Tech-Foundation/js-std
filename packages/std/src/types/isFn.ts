/**
 * Checks if the given value is a function.
 *
 * @example
 *
 * isFn(() => {}) //=> true
 *
 * isFn(1) //=> false
 *
 */

export default function isFn(
  val: unknown,
): val is (...args: unknown[]) => unknown {
  return typeof val === 'function';
}
