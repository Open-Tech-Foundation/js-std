import color, { type ColorFormat, type ColorInput } from './color';

/**
 * Converts a color to grayscale.
 *
 * @param {ColorInput} input - The input color.
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {string | number | object} - The grayscale color.
 */
export default function colorGrayscale(
  input: ColorInput,
  format: ColorFormat = 'hex',
): string | number | object {
  const hsla = color(input, 'hsla-object');
  hsla.s = 0;
  return color(hsla, format);
}
