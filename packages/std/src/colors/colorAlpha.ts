import clamp from '../maths/clamp';
import color, { type ColorFormat, type ColorInput } from './color';

/**
 * Adjusts the alpha channel of a color.
 *
 * @param {ColorInput} input The input color.
 * @param {number} amount The alpha value (0 to 1).
 * @param {ColorFormat} [format='hex'] The output format.
 * @returns {string | number | object} The color with adjusted alpha.
 *
 * @example
 * colorAlpha('red', 0.5, 'rgba') //=> 'rgba(255, 0, 0, 0.5)'
 */
export default function colorAlpha(
  input: ColorInput,
  amount: number,
  format: ColorFormat = 'hex',
): string | number | object {
  const rgba = color(input, 'rgba-object');
  rgba.a = clamp(amount, 0, 1);
  return color(rgba, format);
}
