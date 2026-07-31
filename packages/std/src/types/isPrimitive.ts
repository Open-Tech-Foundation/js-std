/**
 * A value that is not an object: it has no identity of its own, is compared by
 * value and cannot be mutated.
 */
export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined;

/**
 * Checks if the given value is a primitive.
 *
 * The seven primitive types are `string`, `number`, `boolean`, `bigint`,
 * `symbol`, `null` and `undefined`. Everything else is an object, functions
 * included.
 *
 * `null` is one of them, despite `typeof null` being `'object'` — a mistake old
 * enough to be permanent, and the reason a `typeof` check alone gets this
 * wrong.
 *
 * @param {unknown} val The value to check.
 * @returns {boolean} `true` if the value is a primitive.
 *
 * @example
 * isPrimitive(1) //=> true
 *
 * @example
 * isPrimitive(null) //=> true
 *
 * @example
 * isPrimitive({}) //=> false
 *
 * @example
 * isPrimitive(() => {}) //=> false
 */
export default function isPrimitive(val: unknown): val is Primitive {
  return val === null || (typeof val !== 'object' && typeof val !== 'function');
}
