/**
 * Checks if the given value is a generator function.
 *
 * @example
 *
 * isFunction(function() {}) //=> false
 *
 * isFunction(function*() {}) //=> true
 */

export default function isGeneratorFunction(
  val: unknown,
): val is GeneratorFunction {
  return Object.prototype.toString.call(val) === '[object GeneratorFunction]';
}
