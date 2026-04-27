/**
 * Returns a tuple containing the quotient and the remainder.
 *
 * @param {number} a The dividend.
 * @param {number} b The divisor.
 * @returns {[number, number]} A tuple containing [quotient, remainder].
 *
 * @example
 * divMod(4, 2) //=> [2, 0]
 * divMod(11, 4) //=> [2.75, 3]
 */

export default function divMod(a: number, b: number): [number, number] {
  return [a / b, a % b];
}
