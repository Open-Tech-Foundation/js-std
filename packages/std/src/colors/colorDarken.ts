import color, { type ColorFormat } from './color';

/**
 * Decreases the lightness of a color.
 *
 * @param {any} input - The input color.
 * @param {number} amount - The amount to darken (0 to 1).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {any} - The darkened color.
 */
export default function colorDarken(
  input: any,
  amount: number,
  format: ColorFormat = 'hex',
): any {
  const hsla = color(input, 'hsla-object');
  hsla.l = Math.max(0, hsla.l - amount * 100);
  return color(hsla, format);
}
