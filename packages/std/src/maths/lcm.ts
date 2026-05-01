import gcd from './gcd';

/**
 * Calculates the least common multiple of two integers.
 *
 * @param a - The first integer.
 * @param b - The second integer.
 * @returns The least common multiple.
 *
 * @example
 *
 * lcm(4, 6) //=> 12
 * lcm(21, 6) //=> 42
 */
export default function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}
