import isFn from './isFn';

/**
 * Checks if the given value is a Promise object.
 *
 * @example
 *
 * isPromise({}) //=> false
 *
 * isPromise(Promise.resolve()) //=> true
 */
export default function isPromise(val: unknown): boolean {
  return isFn(val?.then);
}
