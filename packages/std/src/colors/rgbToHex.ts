/**
 * Convert RGB colors into hexadecimal color values.
 *
 * @example
 *
 * rgbToHex([ 255, 133, 27 ]) //=> '#FF851B'
 */

export default function RGBToHex(rgb: [number, number, number]): string {
  const r = rgb[0].toString(16);
  const g = rgb[1].toString(16);
  const b = rgb[2].toString(16);

  return '#' + r.padStart(2, '0') + g.padStart(2, '0') + b.padStart(2, '0');
}
