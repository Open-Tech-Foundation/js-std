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

export default function isObj(obj: unknown): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
