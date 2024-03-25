/**
 * Checks if the given value is a Map object.
 *
 * @example
 *
 * isMap(new Map()) //=> true
 *
 * isMap(new WeakMap()) //=> false
 *
 * isMap({}) //=> false
 *
 */

export default function isMap(val: unknown): val is Map<unknown, unknown> {
  return Object.prototype.toString.call(val) === '[object Map]';
}
