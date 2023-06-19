/**
 * Convert hexadecimal color values into RGB color values.
 * @param hex string
 * @returns number[]
 *
 * @example hexToRGB('#FF851B') => [ 255, 133, 27 ]
 */

export default function hexToRGB6(hex: string): number[] {
  return [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16),
  ];
}
