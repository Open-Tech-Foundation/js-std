/**
 * Checks if the given value is a WeakRef object.
 *
 * @example
 *
 * isWkRef({}) //=> false
 *
 * let user = { name: "John" };
 * isWkRef(new WeakRef(user)) //=> true
 *
 */

export default function isWkRef(val: unknown): boolean {
  return Object.prototype.toString.call(val) === '[object WeakRef]';
}
