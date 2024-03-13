import isNull from '../types/isNull';
import isUndef from '../types/isUndef';

/**
 * Checks if the given value is nil or noting.
 *
 * @example
 *
 * isNil() //=> true
 *
 * isNil(null) //=> true
 *
 * isNil(true) //=> false
 */
export default function isNil(val: unknown): boolean {
  if (isNull(val) || isUndef(val)) {
    return true;
  }

  return false;
}
