/**
 * Checks if the given value is a string.
 *
 * @example
 *
 * isString('abc') //=> true
 *
 * isString(String(1)) //=> true
 *
 * isString(1) //=> false
 *
 */

export default function isString(val: unknown): val is string {
  return typeof val === 'string';
}
