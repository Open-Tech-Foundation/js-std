/**
 * Checks if the given value is number.
 *
 * @example
 *
 * isNumber(1) //=> true
 *
 * isNumber('1') //=> false
 *
 * isNumber('1', true) //=> true
 *
 * isNumber(NaN) //=> false
 *
 * isNumber(Infinity) //=> false
 *
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
