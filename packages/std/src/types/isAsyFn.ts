/* eslint-disable @typescript-eslint/ban-types */
/**
 * Checks if the given value is an async function.
 *
 * @example
 *
 * isAsyFn(function() {}) //=> false
 *
 * isAsyFn(async function() {}) //=> true
 */

export default function isAsyFn(
  val: unknown
): val is Function | AsyncGeneratorFunction {
  const a = ['[object AsyncFunction]', '[object AsyncGeneratorFunction]'];
  return a.includes(Object.prototype.toString.call(val));
}
