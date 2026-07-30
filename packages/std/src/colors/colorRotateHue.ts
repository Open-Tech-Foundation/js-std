import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/**
 * Rotates the hue of a color.
 *
 * @param {ColorInput} input - The input color.
 * @param {number} degrees - The degrees to rotate (can be negative).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {ColorOutput} - The hue-rotated color.
 */
export default function colorRotateHue<F extends ColorFormat = 'hex'>(
  input: ColorInput,
  degrees: number,
  format?: F,
): ColorOutput<F>;
export default function colorRotateHue(
  input: ColorInput,
  degrees: number,
  format: ColorFormat = 'hex',
): ColorOutput {
  const hsla = color(input, 'hsla-object');
  hsla.h = (hsla.h + degrees) % 360;
  if (hsla.h < 0) hsla.h += 360;
  return color(hsla, format);
}
