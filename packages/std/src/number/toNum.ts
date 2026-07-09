import isNumber from '../types/isNumber';
import isString from '../types/isString';
import parseFiniteNumberString from './parseFiniteNumberString';

/**
 * Converts the given value into a finite number.
 *
 * @param {unknown} val The value to convert.
 * @returns {number} The converted number or NaN.
 *
 * @example
 * toNum('1.5') //=> 1.5
 * toNum('1_000') //=> 1000
 */

export default function toNum(val: unknown): number {
  if (isNumber(val)) {
    return Number.isFinite(val) ? (val as number) : Number.NaN;
  }

  if (isString(val)) {
    return parseFiniteNumberString(val);
  }

  return Number.NaN;
}
