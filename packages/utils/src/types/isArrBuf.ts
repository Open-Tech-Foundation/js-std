/**
 * Checks if the given value is an ArrayBuffer.
 *
 * @example
 *
 * isArrBuf([]) //=> false
 *
 * isArrBuf(new ArrayBuffer(8)) //=> true
 */

export default function isArrBuf(val: unknown): boolean {
  return Object.prototype.toString.call(val) === '[object ArrayBuffer]';
}
