/**
 * Checks if the given value is defined.
 *
 * @example
 *
 * isDef() //=> false
 * isDef(undefined) //=> false
 * isDef(null) //=> true
 * isDef('') //=> true
 *
 */

export default function isDef(val: unknown): boolean {
  return val !== undefined;
}
