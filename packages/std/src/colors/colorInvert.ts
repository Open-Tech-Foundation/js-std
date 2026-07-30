import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/**
 * Inverts a color.
 *
 * @param {ColorInput} input - The input color.
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {ColorOutput} - The inverted color.
 */
export default function colorInvert<F extends ColorFormat = 'hex'>(
  input: ColorInput,
  format?: F,
): ColorOutput<F>;
export default function colorInvert(
  input: ColorInput,
  format: ColorFormat = 'hex',
): ColorOutput {
  const rgba = color(input, 'rgba-object');
  return color(
    {
      r: 255 - rgba.r,
      g: 255 - rgba.g,
      b: 255 - rgba.b,
      a: rgba.a,
    },
    format,
  );
}
