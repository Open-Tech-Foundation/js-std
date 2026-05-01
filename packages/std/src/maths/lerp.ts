/**
 * Linearly interpolates between two values.
 *
 * @param start - The starting value.
 * @param end - The ending value.
 * @param t - The interpolation factor (0 to 1).
 * @returns The interpolated value.
 *
 * @example
 *
 * lerp(0, 10, 0.5) //=> 5
 * lerp(100, 200, 0.25) //=> 125
 */
export default function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
