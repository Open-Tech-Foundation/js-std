/**
 * Checks if the given value is empty.
 *
 * @example
 *
 * isEmpty([]) //=> true
 *
 * isEmpty({a: null}) //=> false
 */

import isArr from '../types/isArr';
import isArrBuf from '../types/isArrBuf';
import isMap from '../types/isMap';
import isObj from '../types/isObj';
import isSet from '../types/isSet';
import isStr from '../types/isStr';

export default function isEmpty(val: unknown): boolean {
  if (isArr(val) || isStr(val)) {
    return val.length === 0;
  }

  if (isObj(val)) {
    return Object.keys(val).length === 0;
  }

  if (isMap(val) || isSet(val)) {
    return val.size === 0;
  }

  if (isArrBuf(val)) {
    return val.byteLength === 0;
  }

  return false;
}
