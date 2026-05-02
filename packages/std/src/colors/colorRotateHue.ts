import color, { type ColorFormat, type ColorInput } from './color';

/**
 * Rotates the hue of a color.
 *
 * @param {ColorInput} input - The input color.
 * @param {number} degrees - The degrees to rotate (can be negative).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {string | number | object} - The hue-rotated color.
 */
export default function colorRotateHue(
  input: ColorInput,
  degrees: number,
  format: ColorFormat = 'hex',
): string | number | object {
  const hsla = color(input, 'hsla-object');
  hsla.h = (hsla.h + degrees) % 360;
  if (hsla.h < 0) hsla.h += 360;
  return color(hsla, format);
}
