import color, { type ColorFormat, type ColorInput } from './color';

/**
 * Decreases the saturation of a color.
 *
 * @param {ColorInput} input - The input color.
 * @param {number} amount - The amount to desaturate (0 to 1).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {string | number | object} - The desaturated color.
 */
export default function colorDesaturate(
  input: ColorInput,
  amount: number,
  format: ColorFormat = 'hex',
): string | number | object {
  const hsla = color(input, 'hsla-object');
  hsla.s = Math.max(0, hsla.s - amount * 100);
  return color(hsla, format);
}
