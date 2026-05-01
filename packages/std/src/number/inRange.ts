/**
 * Checks if a number is within the specified range (inclusive).
 *
 * @param n - The number to check.
 * @param start - The start of the range.
 * @param end - The end of the range.
 * @returns True if n is between start and end.
 *
 * @example
 *
 * inRange(3, 0, 5) //=> true
 * inRange(-1, 0, 5) //=> false
 */
export default function inRange(
  n: number,
  start: number,
  end: number,
): boolean {
  return n >= start && n <= end;
}
