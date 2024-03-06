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

export default function isRegEx(obj: unknown): boolean {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}
