/**
 * Checks if the given value is a RegExp object.
 *
 * @example
 *
 * isRegEx(new RegExp()) //=> true
 *
 * isRegEx(/a/) //=> true
 *
 * isRegEx({}) //=> false
 *
 */

export default function isRegEx(val: unknown): val is RegExp {
  return Object.prototype.toString.call(val) === '[object RegExp]';
}
