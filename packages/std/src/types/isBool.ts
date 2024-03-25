/**
 * Checks if the given value is boolean.
 *
 * @example
 *
 * isBool(true) //=> true
 *
 * isBool(false) //=> true
 *
 * isBool(null) //=> false
 */

export default function isBool(val: unknown): boolean {
  return typeof val === 'boolean';
}
