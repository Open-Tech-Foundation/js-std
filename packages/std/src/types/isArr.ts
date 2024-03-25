/**
 * Checks if the given value is an array.
 *
 * @example
 *
 * isArr([]) //=> true
 *
 * isArr(new Array('a', 'b', 'c')) //=> true
 *
 * isArr('abc') //=> false
 */

export default function isArr(val: unknown): val is Array<unknown> {
  return Array.isArray(val);
}
