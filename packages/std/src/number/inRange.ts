/**
 * Checks if a number is within the specified range (inclusive).
 *
 * @param n - The number to check.
 * @param options - The inclusive start and end of the range.
 * @returns True if n is between start and end.
 *
 * @example
 *
 * inRange(3, { start: 0, end: 5 }) //=> true
 * inRange(-1, { start: 0, end: 5 }) //=> false
 */
export default function inRange(
  n: number,
  { start, end }: InRangeOptions,
): boolean {
  return n >= start && n <= end;
}
export interface InRangeOptions {
  /** The inclusive start of the range. */
  start: number;
  /** The inclusive end of the range. */
  end: number;
}
