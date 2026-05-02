import color, { type ColorFormat, type ColorInput } from './color';

/**
 * Increases the lightness of a color.
 *
 * @param {ColorInput} input - The input color.
 * @param {number} amount - The amount to lighten (0 to 1).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {string | number | object} - The lightened color.
 */
export default function colorLighten(
  input: ColorInput,
  amount: number,
  format: ColorFormat = 'hex',
): string | number | object {
  const hsla = color(input, 'hsla-object');
  hsla.l = Math.min(100, hsla.l + amount * 100);
  return color(hsla, format);
}
