/**
 * Checks if the given value is an ArrayBuffer.
 *
 * @example
 *
 * isArrayBuffer([]) //=> false
 *
 * isArrayBuffer(new ArrayBuffer(8)) //=> true
 *
 * Checked by probing the internal slot rather than by reading the object's
 * `Object.prototype.toString` tag, which any object can set for itself with
 * `Symbol.toStringTag`. A spoofed tag used to reach code that trusted the
 * answer — `clone` and `isEql` both threw on a plain object tagged `Map` —
 * and the slot cannot be faked. It works across realms either way.
 */

const byteLengthOf = Object.getOwnPropertyDescriptor(
  ArrayBuffer.prototype,
  'byteLength',
)?.get;

export default function isArrayBuffer(val: unknown): val is ArrayBuffer {
  try {
    byteLengthOf?.call(val);
    return byteLengthOf !== undefined;
  } catch {
    return false;
  }
}
