import type { ColorInput } from './color';
import colorLuminance from './colorLuminance';

/** Options for `colorContrast`. */
export interface ColorContrastOptions {
  /** The first color. */
  color1: ColorInput;
  /** The second color. */
  color2: ColorInput;
}

/**
 * Calculates the contrast ratio between two colors.
 *
 * @param {{ color1: ColorInput, color2: ColorInput }} An object naming the two colors.
 * @returns {number} The contrast ratio (1 to 21).
 *
 * @example
 * colorContrast({ color1: '#fff', color2: '#000' }) //=> 21
 */
export default function colorContrast(options: ColorContrastOptions): number {
  const l1 = colorLuminance(options.color1);
  const l2 = colorLuminance(options.color2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Number(ratio.toFixed(2));
}
