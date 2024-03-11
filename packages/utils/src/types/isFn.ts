/**
 * Checks if the given value is a function.
 *
 * @example
 *
 * isFn(function() {}) //=> true
 *
 * isFn({}) //=> false
 */

// eslint-disable-next-line @typescript-eslint/ban-types
export default function isFn(val: unknown): val is Function {
  return typeof val === 'function';
}
