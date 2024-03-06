/**
 * Checks if the given value is a Symbol.
 *
 * @example
 *
 * isSym(Symbol()) //=> true
 *
 * isSym(Symbol('abc')) //=> true
 *
 * isSym('abc') //=> false
 *
 */

export default function isSym(val: unknown): boolean {
  return typeof val === 'symbol';
}
