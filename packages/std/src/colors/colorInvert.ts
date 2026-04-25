import color, { ColorFormat } from './color';

/**
 * Inverts a color.
 *
 * @param {any} input - The input color.
 * @param {ColorFormat} [format='hex'] - The output format.
 * @returns {any} - The inverted color.
 */
export default function colorInvert(
  input: any,
  format: ColorFormat = 'hex',
): any {
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
