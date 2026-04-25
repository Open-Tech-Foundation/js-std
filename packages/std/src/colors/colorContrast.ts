import colorLuminance from './colorLuminance';

/**
 * Calculates the contrast ratio between two colors.
 *
 * @param {any} color1 - The first color.
 * @param {any} color2 - The second color.
 * @returns {number} - The contrast ratio (1 to 21).
 */
export default function colorContrast(color1: any, color2: any): number {
  const l1 = colorLuminance(color1);
  const l2 = colorLuminance(color2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Number(ratio.toFixed(2));
}
