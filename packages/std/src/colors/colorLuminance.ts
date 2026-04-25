import color from './color';

/**
 * Calculates the relative luminance of a color.
 *
 * @param {any} input - The input color.
 * @returns {number} - The relative luminance (0 to 1).
 */
export default function colorLuminance(input: any): number {
  const rgba = color(input, 'rgba-object');
  const [r, g, b] = [rgba.r / 255, rgba.g / 255, rgba.b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return Number((0.2126 * r + 0.7152 * g + 0.0722 * b).toFixed(4));
}
