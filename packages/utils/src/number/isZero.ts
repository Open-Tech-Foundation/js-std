/**
 * Checks if the given number is positive zero (0).
 *
 * @example
 *
 * isZero(-0) //=> false
 * isZero(0) //=> true
 */

export default function isZero(n: number): boolean {
  return Object.is(n, 0);
}
