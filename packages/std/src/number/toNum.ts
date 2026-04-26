import isNumber from '../types/isNumber';
import isString from '../types/isString';

/**
 * Try to convert the given value into a finite number.
 *
 * @example
 *
 * toNum(1) //=> 1
 * toNum('1.3') //=> 1.3
 * toNum('1_000') //=> 1000
 * toNum(Infinity) //=> NaN
 */

export default function toNum(val: unknown): number {
  if (isNumber(val)) {
    return Number.isFinite(val) ? (val as number) : Number.NaN;
  }

  if (isString(val) && isNumber(val, true)) {
    const s = val as string;
    const n = s.includes('_') ? +s.replaceAll('_', '') : +s;
    return Number.isFinite(n) ? n : Number.NaN;
  }

  return Number.NaN;
}
