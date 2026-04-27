import size from '../object/size';
import isArray from '../types/isArray';

/**
 * Checks if the given collection is empty.
 *
 * @param {unknown} val The value to check.
 * @param {boolean} [sparse=false] Whether to check for sparse arrays.
 * @returns {boolean} True if empty, false otherwise.
 *
 * @example
 * isEmpty([]) //=> true
 * isEmpty({a: 1}) //=> false
 */
export default function isEmpty(val: unknown, sparse = false): boolean {
  if (sparse && isArray(val)) {
    return val.every((x) => x === undefined);
  }

  return size(val) === 0;
}
