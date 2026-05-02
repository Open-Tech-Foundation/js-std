import color, { type ColorFormat, type ColorInput } from './color';

/**
 * Increases the saturation of a color.
 *
 * @param {ColorInput} input - The input color.
 * @param {number} amount - The amount to saturate (0 to 1).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {string | number | object} - The saturated color.
 */
export default function colorSaturate(
  input: ColorInput,
  amount: number,
  format: ColorFormat = 'hex',
): string | number | object {
  const hsla = color(input, 'hsla-object');
  hsla.s = Math.min(100, hsla.s + amount * 100);
  return color(hsla, format);
}
