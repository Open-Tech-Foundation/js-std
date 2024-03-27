/**
 * Checks if the given value is a DataView object.
 *
 * @example
 *
 * const buffer = new ArrayBuffer(8)
 *
 * isDataView(buffer) //=> false
 *
 * isDataView(new DataView(buffer)) //=> true
 */

export default function isDataView(val: unknown): val is DataView {
  return Object.prototype.toString.call(val) === '[object DataView]';
}
