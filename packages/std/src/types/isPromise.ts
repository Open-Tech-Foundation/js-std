/**
 * Checks if the given value is a Promise object.
 *
 * @example
 *
 * isPromise({}) //=> false
 *
 * isPromise(Promise.resolve()) //=> true
 */
export default function isPromise(val: unknown): val is Promise<unknown> {
  return Object.prototype.toString.call(val) === '[object Promise]';
}
