/**
 * Checks if the given value is an ArrayBuffer.
 *
 * @example
 *
 * isArrayBuffer([]) //=> false
 *
 * isArrayBuffer(new ArrayBuffer(8)) //=> true
 */

export default function isArrayBuffer(val: unknown): val is ArrayBuffer {
  return Object.prototype.toString.call(val) === '[object ArrayBuffer]';
}
