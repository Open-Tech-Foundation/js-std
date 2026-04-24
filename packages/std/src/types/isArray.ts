/**
 * Checks if the given value is an array.
 *
 * @example
 *
 * isArray([]) //=> true
 *
 * isArray(new Array('a', 'b', 'c')) //=> true
 *
 * isArray('abc') //=> false
 */

export default function isArray(val: unknown): val is Array<unknown> {
  return Array.isArray(val);
}
