/**
 * Checks if the given value is a Set object.
 *
 * @example
 *
 * isSet(new Set()) //=> true
 *
 * isSet(new WeakSet()) //=> false
 *
 * isSet({}) //=> false
 *
 */

export default function isSet(val: unknown): val is Set<unknown> {
  return Object.prototype.toString.call(val) === '[object Set]';
}
