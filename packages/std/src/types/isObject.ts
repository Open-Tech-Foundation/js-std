/**
 * Checks if the given value is an object and not null.
 *
 * @example
 *
 * isObject({}) //=> true
 *
 * isObject([]) //=> true
 *
 * isObject(null) //=> false
 *
 */

export default function isObject(val: unknown): val is object {
  return typeof val === 'object' && val !== null;
}
