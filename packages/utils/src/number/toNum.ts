import isNum from '../types/isNum';
import isStr from '../types/isStr';

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
  if (isNum(val)) {
    return val as number;
  }

  if (isStr(val) && isNum(val, true)) {
    return (val as string).includes('_')
      ? +(val as string).replaceAll('_', '')
      : +(val as string);
  }

  return NaN;
}
