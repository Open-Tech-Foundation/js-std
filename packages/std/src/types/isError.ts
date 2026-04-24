/**
 * Checks if the given value is an error.
 *
 * @example
 *
 * isError(new Error()) //=> true
 *
 * isError({msg: '', name: ''}) //=> false
 */

export default function isError(val: unknown): val is Error {
  return Object.prototype.toString.call(val) === '[object Error]';
}
