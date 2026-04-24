/**
 * Checks if the given value is undefined.
 *
 * @example
 *
 * isUndefined() //=> true
 *
 * isUndefined(undefined) //=> true
 *
 * isUndefined(null) //=> false
 *
 */

export default function isUndefined(val: unknown): val is undefined {
  return typeof val === 'undefined';
}
