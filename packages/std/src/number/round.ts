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
  if (!Number.isInteger(decimals) || !Number.isFinite(decimals)) {
    throw new RangeError('The decimals argument must be a finite integer.');
  }

  if (decimals < -308 || decimals > 308) {
    throw new RangeError(
      'The decimals argument must be between -308 and 308.',
    );
  }

  const factor = 10 ** decimals;
  return Math.round(+`${n}e${decimals}`) / factor;
}
