/**
 * Checks if the given value is a TypedArray.
 *
 * @example
 *
 * isTypedArray([]) //=> false
 *
 * isTypedArray(new Int8Array()) //=> true
 *
 * isTypedArray(new Float64Array()) //=> true
 */

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export default function isTypedArray(val: unknown): val is TypedArray {
  const typedArrClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]',
    '[object BigInt64Array]',
    '[object BigUint64Array]',
  ];

  return typedArrClasses.includes(Object.prototype.toString.call(val));
}
