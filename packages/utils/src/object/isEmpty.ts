import size from './size';

/**
 * Checks if the given value is empty.
 *
 * @example
 *
 * isEmpty([]) //=> true
 *
 * isEmpty({a: null}) //=> false
 */
export default function isEmpty(val: unknown): boolean {
  return size(val) === 0;
}
