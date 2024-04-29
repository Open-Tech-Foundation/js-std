/**
 * Checks if the given value is a plain object.
 *
 * @example
 *
 * isObj({}) //=> true
 *
 * isObj([]) //=> false
 *
 * isObj(Object.create(null)) //=> true
 *
 */

export default function isObj(val: unknown): val is object {
  if (Object.prototype.toString.call(val) !== '[object Object]') {
    return false;
  }

  const p = Object.getPrototypeOf(val);

  return p === null || Object.getPrototypeOf(p) === null;
}
