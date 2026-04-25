import colorLuminance from './colorLuminance';

/**
 * Checks if a color is light.
 *
 * @param {any} input - The input color.
 * @returns {boolean} - True if the color is light.
 */
export default function colorIsLight(input: any): boolean {
  return colorLuminance(input) >= 0.5;
}
