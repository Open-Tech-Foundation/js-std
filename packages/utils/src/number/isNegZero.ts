/**
 * Checks if the given number is negative zero (-0).
 *
 * @example
 *
 * isNegZero() //=> false
 * isNegZero(null) //=> false
 * isNegZero('') //=> false
 * isNegZero(0) //=> false
 * isNegZero(-0) //=> true */

export default function isNegZero(n: number): boolean {
  return Object.is(n, -0);
}
