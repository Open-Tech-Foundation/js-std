/**
 * Checks if the given value is a finite number.
 *
 * @param {unknown} val The value to check.
 * @returns {boolean} True if the value is a number, false otherwise.
 *
 * @example
 * isNumber(1) //=> true
 * isNumber('1') //=> false
 */
export default function isNumber(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val);
}
