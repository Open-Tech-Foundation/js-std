/**
 * Checks if the given value is a function.
 *
 * @example
 *
 * isFunction(() => {}) //=> true
 *
 * isFunction(1) //=> false
 *
 */

export default function isFunction(
  val: unknown,
): val is (...args: unknown[]) => unknown {
  return typeof val === 'function';
}
