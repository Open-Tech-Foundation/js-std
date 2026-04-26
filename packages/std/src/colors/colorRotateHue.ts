import color, { type ColorFormat } from './color';

/**
 * Rotates the hue of a color.
 *
 * @param {any} input - The input color.
 * @param {number} degrees - The degrees to rotate (can be negative).
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {any} - The hue-rotated color.
 */
export default function colorRotateHue(
  input: any,
  degrees: number,
  format: ColorFormat = 'hex',
): any {
  const hsla = color(input, 'hsla-object');
  hsla.h = (hsla.h + degrees) % 360;
  if (hsla.h < 0) hsla.h += 360;
  return color(hsla, format);
}
