/**
 * Checks if the given number is positive zero (0).
 *
 * @param {number} n The number to check.
 * @returns {boolean} True if 0, false otherwise.
 *
 * @example
 * isZero(0) //=> true
 * isZero(-0) //=> false
 */

export default function isZero(n: number): boolean {
  return Object.is(n, 0);
}
