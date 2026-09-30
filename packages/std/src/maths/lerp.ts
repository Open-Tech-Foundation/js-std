/** Options for {@link lerp}. */
export interface LerpOptions {
  /** The starting value. */
  start: number;
  /** The ending value. */
  end: number;
  /** The interpolation parameter `t` in `start + (end - start) * t`. */
  progress: number;
}

/**
 * Linearly interpolates between two values.
 *
 * `progress` is the interpolation parameter `t` in the formula
 * `start + (end - start) * t`. A value from 0 to 1 moves from `start` to
 * `end`; values outside that range extrapolate beyond the endpoints.
 *
 * @param options - The starting value, ending value, and interpolation progress.
 * @returns The interpolated value.
 *
 * @example
 *
 * lerp({ start: 0, end: 10, progress: 0.5 }) //=> 5
 * lerp({ start: 100, end: 200, progress: 0.25 }) //=> 125
 */
export default function lerp({ start, end, progress }: LerpOptions): number {
  return start + (end - start) * progress;
}
