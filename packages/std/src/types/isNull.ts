/**
 * Checks if the given value is null.
 *
 * @example
 *
 * isNull(null) //=> true
 *
 * isNull(undefined) //=> false
 *
 */

export default function isNull(val: unknown): val is null {
  return val === null;
}
