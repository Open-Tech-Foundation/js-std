/**
 * Checks if the given value is a WeakSet object.
 *
 * @example
 *
 * isWeakSet(new Set()) //=> false
 *
 * isWeakSet(new WeakSet()) //=> true
 *
 */

export default function isWeakSet(val: unknown): val is WeakSet<WeakKey> {
  return Object.prototype.toString.call(val) === '[object WeakSet]';
}
