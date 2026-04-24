/**
 * Checks if the given value is a generator function.
 *
 * @example
 *
 * isFunction(function() {}) //=> false
 *
 * isFunction(function*() {}) //=> true
 */

export default function isGeneratorFunction(val: unknown): val is GeneratorFunction {
  const a = ['[object GeneratorFunction]', '[object AsyncGeneratorFunction]'];
  return a.includes(Object.prototype.toString.call(val));
}
