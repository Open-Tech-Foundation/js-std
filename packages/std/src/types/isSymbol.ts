/**
 * Checks if the given value is a Symbol.
 *
 * @example
 *
 * isSymbol(Symbol()) //=> true
 *
 * isSymbol(Symbol('abc')) //=> true
 *
 * isSymbol('abc') //=> false
 *
 */

export default function isSymbol(val: unknown): val is symbol {
  return typeof val === 'symbol';
}
