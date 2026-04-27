/**
 * Checks if the given number is negative zero (-0).
 *
 * @param {number} n The number to check.
 * @returns {boolean} True if -0, false otherwise.
 *
 * @example
 * isNegZero(-0) //=> true
 * isNegZero(0) //=> false
 */

export default function isNegZero(n: number): boolean {
  return Object.is(n, -0);
}
