/**
 * Checks if the given value is a RegExp object.
 *
 * @example
 *
 * isRegExp(new RegExp()) //=> true
 *
 * isRegExp(/a/) //=> true
 *
 * isRegExp({}) //=> false
 *
 */

export default function isRegExp(val: unknown): val is RegExp {
  return Object.prototype.toString.call(val) === '[object RegExp]';
}
