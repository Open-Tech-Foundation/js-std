import colorLuminance from './colorLuminance';

/**
 * Checks if a color is dark.
 *
 * @param {any} input - The input color.
 * @returns {boolean} - True if the color is dark.
 */
export default function colorIsDark(input: any): boolean {
  return colorLuminance(input) < 0.5;
}
