/**
 * Checks if the given value is a plain object (i.e., created via `{}` or `Object.create(null)`).
 *
 * @example
 *
 * isPlainObject({}) //=> true
 *
 * isPlainObject([]) //=> false
 *
 * isPlainObject(Object.create(null)) //=> true
 *
 * isPlainObject(new Map()) //=> false
 *
 * isPlainObject(null) //=> false
 *
 */

export default function isPlainObject(
  val: unknown,
): val is Record<string, unknown> {
  if (Object.prototype.toString.call(val) !== '[object Object]') {
    return false;
  }
  const p = Object.getPrototypeOf(val);
  return p === null || Object.getPrototypeOf(p) === null;
}
