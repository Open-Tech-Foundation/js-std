/**
 * Checks if the given value is a finite number.
 *
 * @param {unknown} val The value to check.
 * @param {boolean} [coerce=false] Whether to coerce strings to numbers.
 * @returns {boolean} True if the value is a number, false otherwise.
 *
 * @example
 * isNumber(1) //=> true
 * isNumber('1', true) //=> true
 */
export default function isNumber(val: unknown, coerce = false): val is number {
  let n = val;
  if (coerce && typeof val === 'string' && val.trim().length) {
    const regex = /_{2,}|^0_1|^_|_$/;
    if (val.includes('_') && !regex.test(val.trim())) {
      n = val.replaceAll('_', '');
    }
    n = Number(n);
  }

  return typeof n === 'number' && Number.isFinite(n);
}
