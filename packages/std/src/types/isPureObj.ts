/**
 * Checks if the given value is an object and not null.
 *
 * @example
 *
 * isPureObj({}) //=> true
 *
 * isPureObj([]) //=> true
 *
 * isPureObj(null) //=> false
 *
 */

export default function isPureObj(val: unknown): val is object {
  return typeof val === 'object' && val !== null;
}
