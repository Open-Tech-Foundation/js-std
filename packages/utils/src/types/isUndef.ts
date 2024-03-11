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

export default function isUndef(val: unknown): val is undefined {
  return typeof val === 'undefined';
}
