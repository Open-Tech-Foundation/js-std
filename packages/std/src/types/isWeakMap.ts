/**
 * Checks if the given value is a WeakMap object.
 *
 * @example
 *
 * isWeakMap(new Map()) //=> false
 *
 * isWeakMap(new WeakMap()) //=> true
 *
 */

export default function isWeakMap(
  val: unknown,
): val is WeakMap<WeakKey, unknown> {
  return Object.prototype.toString.call(val) === '[object WeakMap]';
}
