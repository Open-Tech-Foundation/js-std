/**
 * Checks if the given value is a string.
 *
 * @example
 *
 * isStr('abc') //=> true
 *
 * isStr(String(1)) //=> true
 *
 * isStr(1) //=> false
 *
 */

export default function isStr(val: unknown): val is string {
  return typeof val === 'string';
}
