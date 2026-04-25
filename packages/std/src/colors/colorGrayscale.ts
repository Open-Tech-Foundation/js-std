import color, { ColorFormat } from './color';

/**
 * Converts a color to grayscale.
 *
 * @param {any} input - The input color.
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {any} - The grayscale color.
 */
export default function colorGrayscale(
  input: any,
  format: ColorFormat = 'hex',
): any {
  const hsla = color(input, 'hsla-object');
  hsla.s = 0;
  return color(hsla, format);
}
