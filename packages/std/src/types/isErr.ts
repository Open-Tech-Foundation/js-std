/**
 * Checks if the given value is an error.
 *
 * @example
 *
 * isErr(new Error()) //=> true
 *
 * isErr({msg: '', name: ''}) //=> false
 */

export default function isErr(val: unknown): val is Error {
  return Object.prototype.toString.call(val) === '[object Error]';
}
