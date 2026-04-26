import clamp from '../maths/clamp';
import color, { type ColorFormat } from './color';

/**
 * Adjusts the alpha channel of a color.
 *
 * @param {any} input - The input color.
 * @param {number} amount - The alpha value (0 to 1).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {any} - The color with adjusted alpha.
 */
export default function colorAlpha(
  input: any,
  amount: number,
  format: ColorFormat = 'hex',
): any {
  const rgba = color(input, 'rgba-object');
  rgba.a = clamp(amount, 0, 1);
  return color(rgba, format);
}
