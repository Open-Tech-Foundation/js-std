/**
 * Checks if the given value is a WeakMap object.
 *
 * @example
 *
 * isWkMap(new Map()) //=> false
 *
 * isWkMap(new WeakMap()) //=> true
 *
 */

export default function isWkMap(
  val: unknown
): val is WeakMap<WeakKey, unknown> {
  return Object.prototype.toString.call(val) === '[object WeakMap]';
}
