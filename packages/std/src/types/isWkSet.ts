/**
 * Checks if the given value is a WeakSet object.
 *
 * @example
 *
 * isWkSet(new Set()) //=> false
 *
 * isWkSet(new WeakSet()) //=> true
 *
 */

export default function isWkSet(val: unknown): val is WeakSet<WeakKey> {
  return Object.prototype.toString.call(val) === '[object WeakSet]';
}
