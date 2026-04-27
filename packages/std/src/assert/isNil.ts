import isNull from '../types/isNull';
import isUndefined from '../types/isUndefined';

/**
 * Checks if the given value is null or undefined.
 *
 * @param {unknown} val The value to check.
 * @returns {boolean} True if null or undefined, false otherwise.
 *
 * @example
 * isNil(null) //=> true
 * isNil(undefined) //=> true
 * isNil(1) //=> false
 */
export default function isNil(val: unknown): boolean {
  if (isNull(val) || isUndefined(val)) {
    return true;
  }

  return false;
}
