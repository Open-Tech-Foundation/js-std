/**
 * Checks if the given value is a valid date object.
 *
 * @example
 *
 * isDate(new Date()) //=> true
 *
 * isDate(new Date('')) //=> false
 *
 * isDate('2000-01-01') //=> false
 */

export default function isDate(val: unknown): val is Date {
  return (
    Object.prototype.toString.call(val) === '[object Date]' &&
    (val as Date).toString() !== 'Invalid Date'
  );
}
