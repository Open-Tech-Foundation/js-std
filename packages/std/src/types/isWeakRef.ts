/**
 * Checks if the given value is a WeakRef object.
 *
 * @example
 *
 * isWeakRef({}) //=> false
 *
 * let user = { name: "John" };
 * isWeakRef(new WeakRef(user)) //=> true
 *
 */

export default function isWeakRef(val: unknown): val is WeakRef<WeakKey> {
  return Object.prototype.toString.call(val) === '[object WeakRef]';
}
