/**
 * Converts an HSL color value to RGB.
 *
 * @example
 *
 * hslToRgb(0, 100, 50) //=> [255, 0, 0]
 */
export default function hslToRgb(
  h: number,
  s: number,
  l: number,
): [number, number, number] {
  const hue = h / 360;
  const sat = s / 100;
  const light = l / 100;

  let r: number;
  let g: number;
  let b: number;

  if (sat === 0) {
    r = g = b = light; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tr = t;
      if (tr < 0) tr += 1;
      if (tr > 1) tr -= 1;
      if (tr < 1 / 6) return p + (q - p) * 6 * tr;
      if (tr < 1 / 2) return q;
      if (tr < 2 / 3) return p + (q - p) * (2 / 3 - tr) * 6;
      return p;
    };

    const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
    const p = 2 * light - q;

    r = hue2rgb(p, q, hue + 1 / 3);
    g = hue2rgb(p, q, hue);
    b = hue2rgb(p, q, hue - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
