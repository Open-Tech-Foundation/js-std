/**
 * Checks if the given value is boolean.
 *
 * @example
 *
 * isBoolean(true) //=> true
 *
 * isBoolean(false) //=> true
 *
 * isBoolean(null) //=> false
 */

export default function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean';
}
