/** Options for {@link clamp}. */
export interface ClampOptions {
  /** The lower bound of the inclusive range. */
  min: number;
  /** The upper bound of the inclusive range. */
  max: number;
}

/**
 * Returns a value clamped to the inclusive range of min and max.
 *
 * @param {number} val The value to clamp.
 * @param {ClampOptions} options The lower and upper bounds.
 * @returns {number} The clamped value.
 *
 * @example
 * clamp(10, { min: -5, max: 5 }) //=> 5
 * clamp(0, { min: 1000, max: 1366 }) //=> 1000
 */

export default function clamp(val: number, { min, max }: ClampOptions): number {
  return Math.min(Math.max(val, min), max);
}
