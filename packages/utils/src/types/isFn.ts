/**
 * Checks if the given value is a function.
 *
 * @example
 *
 * isFn(function() {}) //=> true
 *
 * isFn({}) //=> false
 */

export default function isFn(val: unknown): boolean {
  return typeof val === 'function';
}
