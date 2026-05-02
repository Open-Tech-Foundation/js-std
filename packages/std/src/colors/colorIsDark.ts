import type { ColorInput } from './color';
import colorLuminance from './colorLuminance';

/**
 * Checks if a color is dark.
 *
 * @param {ColorInput} input - The input color.
 * @returns {boolean} - True if the color is dark.
 */
export default function colorIsDark(input: ColorInput): boolean {
  return colorLuminance(input) < 0.5;
}
