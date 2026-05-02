import color, { type ColorFormat, type ColorInput } from './color';

/**
 * Decreases the lightness of a color.
 *
 * @param {ColorInput} input - The input color.
 * @param {number} amount - The amount to darken (0 to 1).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {string | number | object} - The darkened color.
 */
export default function colorDarken(
  input: ColorInput,
  amount: number,
  format: ColorFormat = 'hex',
): string | number | object {
  const hsla = color(input, 'hsla-object');
  hsla.l = Math.max(0, hsla.l - amount * 100);
  return color(hsla, format);
}
