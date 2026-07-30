import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/**
 * Converts a color to grayscale.
 *
 * @param {ColorInput} input - The input color.
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {ColorOutput} - The grayscale color.
 */
export default function colorGrayscale<F extends ColorFormat = 'hex'>(
  input: ColorInput,
  format?: F,
): ColorOutput<F>;
export default function colorGrayscale(
  input: ColorInput,
  format: ColorFormat = 'hex',
): ColorOutput {
  const hsla = color(input, 'hsla-object');
  hsla.s = 0;
  return color(hsla, format);
}
