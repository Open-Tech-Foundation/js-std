/**
 * Returns a tuple with Quotient and Remainder.
 *
 * @example
 *
 * divMod(4, 2) //=> [2, 0]
 * divMod(11, 4) //=> [2.75, 3]
 * divMod(1, 0) //=> [Infinity, NaN]
 */

export default function divMod(a: number, b: number): [number, number] {
  return [a / b, a % b];
}
