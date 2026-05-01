/**
 * Calculates the greatest common divisor of two integers.
 *
 * @param a - The first integer.
 * @param b - The second integer.
 * @returns The greatest common divisor.
 *
 * @example
 *
 * gcd(12, 8) //=> 4
 * gcd(54, 24) //=> 6
 */
export default function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}
