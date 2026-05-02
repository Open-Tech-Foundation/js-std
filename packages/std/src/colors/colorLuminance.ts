import color, { type ColorInput } from './color';

/**
 * Calculates the relative luminance of a color.
 *
 * @param {ColorInput} input - The input color.
 * @returns {number} - The relative luminance (0 to 1).
 */
export default function colorLuminance(input: ColorInput): number {
  const rgba = color(input, 'rgba-object');
  const [r, g, b] = [rgba.r / 255, rgba.g / 255, rgba.b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
  });
  return Number((0.2126 * r + 0.7152 * g + 0.0722 * b).toFixed(4));
}
