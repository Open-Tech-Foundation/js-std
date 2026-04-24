import rgbToHsl from './rgbToHsl';

/**
 * Converts an RGBA object to an hsl/hsla string.
 *
 * @example
 *
 * colorToHsl({ r: 255, g: 0, b: 0, a: 1 }) //=> 'hsl(0, 100%, 50%)'
 */
export default function colorToHsl(color: {
  r: number;
  g: number;
  b: number;
  a: number;
}): string {
  const [h, s, l] = rgbToHsl(color.r, color.g, color.b);
  if (color.a === 1) {
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  return `hsla(${h}, ${s}%, ${l}%, ${color.a})`;
}
