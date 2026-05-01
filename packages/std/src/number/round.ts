/**
 * Rounds a number to a specified number of decimal places without
 * floating point precision drift.
 *
 * @param n - The number to round.
 * @param decimals - The number of decimal places (default 0).
 * @returns The rounded number.
 *
 * @example
 *
 * round(1.005, 2) //=> 1.01 (not 1.00 like Math.round)
 * round(1.23456, 3) //=> 1.235
 */
export default function round(n: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(+`${n}e${decimals}`) / factor;
}
