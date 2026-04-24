/**
 * Converts an RGBA object to an rgb/rgba string.
 *
 * @example
 *
 * colorToRgb({ r: 255, g: 0, b: 0, a: 1 }) //=> 'rgb(255, 0, 0)'
 *
 * colorToRgb({ r: 255, g: 0, b: 0, a: 0.5 }) //=> 'rgba(255, 0, 0, 0.5)'
 */
export default function colorToRgb(color: {
  r: number;
  g: number;
  b: number;
  a: number;
}): string {
  if (color.a === 1) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}
