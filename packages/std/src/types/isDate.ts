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
 *
 * Checked by probing the internal slot rather than by reading the object's
 * `Object.prototype.toString` tag, which any object can set for itself with
 * `Symbol.toStringTag`. A spoofed tag used to reach code that trusted the
 * answer — `clone` and `isEql` both threw on a plain object tagged `Map` —
 * and the slot cannot be faked. It works across realms either way.
 */

export default function isDate(val: unknown): val is Date {
  let time: number;

  try {
    time = Date.prototype.getTime.call(val as Date);
  } catch {
    return false;
  }

  // An invalid date is a `Date`, but not one anything can use.
  return !Number.isNaN(time);
}
