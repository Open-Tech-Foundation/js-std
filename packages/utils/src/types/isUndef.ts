/**
 * Checks if the given value is undefined.
 *
 * @example
 *
 * isUndef() //=> true
 *
 * isUndef(undefined) //=> true
 *
 * isUndef(null) //=> false
 *
 */

export default function isUndef(val: unknown): boolean {
  return typeof val === 'undefined';
}
