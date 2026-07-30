import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/**
 * Decreases the lightness of a color.
 *
 * @param {ColorInput} input - The input color.
 * @param {number} amount - The amount to darken (0 to 1).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {ColorOutput} - The darkened color.
 */
export default function colorDarken<F extends ColorFormat = 'hex'>(
  input: ColorInput,
  amount: number,
  format?: F,
): ColorOutput<F>;
export default function colorDarken(
  input: ColorInput,
  amount: number,
  format: ColorFormat = 'hex',
): ColorOutput {
  const hsla = color(input, 'hsla-object');
  hsla.l = Math.max(0, hsla.l - amount * 100);
  return color(hsla, format);
}
