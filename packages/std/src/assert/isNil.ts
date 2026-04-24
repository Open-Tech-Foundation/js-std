import isNull from '../types/isNull';
import isUndefined from '../types/isUndefined';

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
  if (isNull(val) || isUndefined(val)) {
    return true;
  }

  return false;
}
