import color, { type ColorFormat } from './color';

/**
 * Increases the lightness of a color.
 *
 * @param {any} input - The input color.
 * @param {number} amount - The amount to lighten (0 to 1).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {any} - The lightened color.
 */
export default function colorLighten(
  input: any,
  amount: number,
  format: ColorFormat = 'hex',
): any {
  const hsla = color(input, 'hsla-object');
  hsla.l = Math.min(100, hsla.l + amount * 100);
  return color(hsla, format);
}
