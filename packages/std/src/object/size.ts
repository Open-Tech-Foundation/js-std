import isArray from '../types/isArray';
import isArrayBuffer from '../types/isArrayBuffer';
import isDataView from '../types/isDataView';
import isMap from '../types/isMap';
import isPlainObject from '../types/isPlainObject';
import isSet from '../types/isSet';
import isString from '../types/isString';
import isTypedArray from '../types/isTypedArray';

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
export default function size(val: unknown): number {
  if (isArray(val) || isString(val) || isTypedArray(val)) {
    return val.length;
  }

  if (isPlainObject(val)) {
    return Object.keys(val).length;
  }

  if (isMap(val) || isSet(val)) {
    return val.size;
  }

  if (isArrayBuffer(val) || isDataView(val)) {
    return val.byteLength;
  }

  return -1;
}
