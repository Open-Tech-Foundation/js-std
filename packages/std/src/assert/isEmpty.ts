import size from '../object/size';
import isArray from '../types/isArray';

/**
 * Checks if the given collection is empty.
 *
 * @example
 *
 * isEmpty([]) //=> true
 *
 * isEmpty({a: null}) //=> false
 */
export default function isEmpty(val: unknown, sparse = false): boolean {
  if (sparse && isArray(val)) {
    return val.every((x) => x === undefined);
  }

  return size(val) === 0;
}
