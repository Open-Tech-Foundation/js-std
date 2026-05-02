import type { ColorInput } from './color';
import colorLuminance from './colorLuminance';

/**
 * Checks if a color is light.
 *
 * @param {ColorInput} input - The input color.
 * @returns {boolean} - True if the color is light.
 */
export default function colorIsLight(input: ColorInput): boolean {
  return colorLuminance(input) >= 0.5;
}
