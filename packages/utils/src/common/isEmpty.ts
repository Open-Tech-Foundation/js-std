import size from '../object/size';

/**
 * Checks if the given collection is empty.
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
