import hexToRGB from './hexToRGB';
import hslToRgb from './hslToRgb';

type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

/**
 * Parses a color string into an RGBA object.
 * Supports hex, rgb, rgba, hsl, hsla.
 *
 * @example
 *
 * colorParse('#ff0000') //=> { r: 255, g: 0, b: 0, a: 1 }
 *
 * colorParse('rgb(255, 0, 0)') //=> { r: 255, g: 0, b: 0, a: 1 }
 */
export default function colorParse(str: string): Color | null {
  const s = str.trim().toLowerCase();

  // Hex
  if (s.startsWith('#')) {
    if (s.length === 4) {
      const r = Number.parseInt(s[1] + s[1], 16);
      const g = Number.parseInt(s[2] + s[2], 16);
      const b = Number.parseInt(s[3] + s[3], 16);
      return { r, g, b, a: 1 };
    }
    if (s.length === 7) {
      const [r, g, b] = hexToRGB(str);
      return { r, g, b, a: 1 };
    }
    if (s.length === 9) {
      const [r, g, b] = hexToRGB(s.substring(0, 7));
      const a = Number.parseInt(s.substring(7, 9), 16) / 255;
      return { r, g, b, a: Number(a.toFixed(2)) };
    }
    return null;
  }

  // RGB/RGBA
  const rgbMatch = s.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)$/,
  );
  if (rgbMatch) {
    return {
      r: Number.parseInt(rgbMatch[1], 10),
      g: Number.parseInt(rgbMatch[2], 10),
      b: Number.parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] === undefined ? 1 : Number.parseFloat(rgbMatch[4]),
    };
  }

  // HSL/HSLA
  const hslMatch = s.match(
    /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)$/,
  );
  if (hslMatch) {
    const h = Number.parseInt(hslMatch[1], 10);
    const s = Number.parseInt(hslMatch[2], 10);
    const l = Number.parseInt(hslMatch[3], 10);
    const [r, g, b] = hslToRgb(h, s, l);
    return {
      r,
      g,
      b,
      a: hslMatch[4] === undefined ? 1 : Number.parseFloat(hslMatch[4]),
    };
  }

  return null;
}
