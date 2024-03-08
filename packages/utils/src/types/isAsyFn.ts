/**
 * Checks if the given value is an async function.
 *
 * @example
 *
 * isAsyFn(function() {}) //=> false
 *
 * isAsyFn(async function() {}) //=> true
 */

export default function isAsyFn(val: unknown): boolean {
  const a = ['[object AsyncFunction]', '[object AsyncGeneratorFunction]'];
  return a.includes(Object.prototype.toString.call(val));
}
