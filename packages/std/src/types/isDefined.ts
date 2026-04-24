/**
 * Checks if the given value is defined.
 *
 * @example
 *
 * isDefined() //=> false
 * isDefined(undefined) //=> false
 * isDefined(null) //=> true
 * isDefined('') //=> true
 *
 */

export default function isDefined(val: unknown): boolean {
  return val !== undefined;
}
