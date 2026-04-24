/**
 * Converts an RGBA object to a hex string.
 *
 * @example
 *
 * colorToHex({ r: 255, g: 0, b: 0, a: 1 }) //=> '#ff0000'
 */
export default function colorToHex(color: {
  r: number;
  g: number;
  b: number;
  a: number;
}): string {
  const r = color.r.toString(16).padStart(2, '0');
  const g = color.g.toString(16).padStart(2, '0');
  const b = color.b.toString(16).padStart(2, '0');
  let a = '';
  if (color.a < 1) {
    a = Math.round(color.a * 255)
      .toString(16)
      .padStart(2, '0');
  }
  return `#${r}${g}${b}${a}`;
}
