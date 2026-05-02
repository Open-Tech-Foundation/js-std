import color, { type ColorFormat, type ColorInput } from './color';

/**
 * Inverts a color.
 *
 * @param {ColorInput} input - The input color.
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {string | number | object} - The inverted color.
 */
export default function colorInvert(
  input: ColorInput,
  format: ColorFormat = 'hex',
): string | number | object {
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
