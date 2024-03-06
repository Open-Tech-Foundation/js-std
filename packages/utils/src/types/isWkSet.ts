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

export default function isWkSet(val: unknown): boolean {
  return Object.prototype.toString.call(val) === '[object WeakSet]';
}
