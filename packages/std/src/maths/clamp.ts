/**
 * Returns a value clamped to the inclusive range of min and max.
 *
 * @example
 *
 * clamp(0, 1000, 1366) //=> 1000
 * clamp(1000, 1000, 1366) //=> 1000
 * clamp(1001, 1000, 1366) //=> 1001
 * clamp(1500, 1000, 1366) //=> 1366
 */

export default function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
