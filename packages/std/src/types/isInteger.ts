/**
 * Checks if the given value is an integer.
 *
 * @param {unknown} val The value to check.
 * @param {boolean} [coerce=false] Whether to coerce strings to numbers.
 * @returns {boolean} True if the value is an integer, false otherwise.
 *
 * @example
 * isInteger(1) //=> true
 * isInteger(1.5) //=> false
 * isInteger('1', true) //=> true
 */
export default function isInteger(val: unknown, coerce = false): val is number {
  let n = val;
  if (coerce && typeof val === 'string' && val.trim().length) {
    const regex = /_{2,}|^0_1|^_|_$/;
    if (val.includes('_') && !regex.test(val.trim())) {
      n = val.replaceAll('_', '');
    }
    n = Number(n);
  }

  return typeof n === 'number' && Number.isInteger(n);
}
