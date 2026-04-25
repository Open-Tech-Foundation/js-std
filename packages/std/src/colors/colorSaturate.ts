import color, { ColorFormat } from './color';

/**
 * Increases the saturation of a color.
 *
 * @param {any} input - The input color.
 * @param {number} amount - The amount to saturate (0 to 1).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {any} - The saturated color.
 */
export default function colorSaturate(
  input: any,
  amount: number,
  format: ColorFormat = 'hex',
): any {
  const hsla = color(input, 'hsla-object');
  hsla.s = Math.min(100, hsla.s + amount * 100);
  return color(hsla, format);
}
