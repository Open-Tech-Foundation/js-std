/**
 * Checks if the given value is number.
 *
 * @example
 *
 * isNum(1) //=> true
 *
 * isNum('1') //=> false
 *
 * isNum('1', true) //=> true
 *
 * isNum(NaN) //=> false
 *
 * isNum(Infinity) //=> false
 *
 */

export default function isNum(val: unknown, coerce = false): boolean {
  let n = val;
  if (coerce && typeof val === 'string') {
    const regex = /_{2,}|^0_1|^_|_$/;
    if (val.includes('_') && !regex.test(val.trim())) {
      n = val.replaceAll('_', '');
    }
    n = Number(n);
  }

  return typeof n === 'number' && Number.isFinite(n);
}
