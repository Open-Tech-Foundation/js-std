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

export default function isDefined<T>(val: T): val is Exclude<T, undefined> {
  return val !== undefined;
}
