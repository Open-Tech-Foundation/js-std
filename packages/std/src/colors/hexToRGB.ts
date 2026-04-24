/**
 * Convert hexadecimal color values into RGB color values.
 *
 * @example
 *
 * hexToRGB('#FF851B') => [ 255, 133, 27 ]
 */

export default function hexToRGB(hex: string): number[] {
  return [
    Number.parseInt(hex.substring(1, 3), 16),
    Number.parseInt(hex.substring(3, 5), 16),
    Number.parseInt(hex.substring(5, 7), 16),
  ];
}
