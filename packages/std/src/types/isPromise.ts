import isFunction from './isFunction';

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
  return isFunction((val as Record<string, unknown>)?.then);
}
