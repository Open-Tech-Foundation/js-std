import isArr from '../types/isArr';
import isArrBuf from '../types/isArrBuf';
import isMap from '../types/isMap';
import isObj from '../types/isObj';
import isSet from '../types/isSet';
import isStr from '../types/isStr';

/**
 * Returns the size of the given value.
 *
 * @example
 *
 * size([]) //=> 0
 *
 * size('a') //=> 1
 *
 * size({a: 1, b: 3}) //=> 2
 */
export default function size(val: unknown): number | null {
  if (isArr(val) || isStr(val)) {
    return val.length;
  }

  if (isObj(val)) {
    return Object.keys(val).length;
  }

  if (isMap(val) || isSet(val)) {
    return val.size;
  }

  if (isArrBuf(val)) {
    return val.byteLength;
  }

  return null;
}
