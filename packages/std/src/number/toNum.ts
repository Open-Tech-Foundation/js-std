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
    return val as number;
  }

  if (isString(val) && isNumber(val, true)) {
    return (val as string).includes('_')
      ? +(val as string).replaceAll('_', '')
      : +(val as string);
  }

  return Number.NaN;
}
