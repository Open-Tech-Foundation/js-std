import size from '../object/size';
import isArr from '../types/isArr';

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
  if (sparse && isArr(val)) {
    return val.filter((x) => x !== undefined).length === 0;
  }

  return size(val) === 0;
}
