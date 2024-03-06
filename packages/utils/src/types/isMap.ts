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

export default function isMap(val: unknown): boolean {
  return Object.prototype.toString.call(val) === '[object Map]';
}
