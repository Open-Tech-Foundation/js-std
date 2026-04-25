import color, { ColorFormat } from './color';

/**
 * Decreases the saturation of a color.
 *
 * @param {any} input - The input color.
 * @param {number} amount - The amount to desaturate (0 to 1).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {any} - The desaturated color.
 */
export default function colorDesaturate(
  input: any,
  amount: number,
  format: ColorFormat = 'hex',
): any {
  const hsla = color(input, 'hsla-object');
  hsla.s = Math.max(0, hsla.s - amount * 100);
  return color(hsla, format);
}
