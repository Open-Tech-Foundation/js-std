/**
 * Returns a value clamped to the inclusive range of min and max.
 *
 * @param {number} val The value to clamp.
 * @param {number} min The lower bound.
 * @param {number} max The upper bound.
 * @returns {number} The clamped value.
 *
 * @example
 * clamp(10, -5, 5) //=> 5
 * clamp(0, 1000, 1366) //=> 1000
 */

export default function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
