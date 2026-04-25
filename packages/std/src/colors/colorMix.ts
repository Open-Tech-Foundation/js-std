import color from './color';

/**
 * Mixes two colors together.
 *
 * @param {any} color1 - The first color.
 * @param {any} color2 - The second color.
 * @param {number} [weight=0.5] - The weight of the first color (0 to 1).
 * @param {string} [format='hex'] - The output format.
 * @returns {any} - The mixed color.
 */
export default function colorMix(
  color1: any,
  color2: any,
  weight: number = 0.5,
  format: any = 'hex',
): any {
  const rgba1 = color(color1, 'rgba-object');
  const rgba2 = color(color2, 'rgba-object');

  const w = weight;
  const w2 = 1 - w;

  const r = Math.round(rgba1.r * w + rgba2.r * w2);
  const g = Math.round(rgba1.g * w + rgba2.g * w2);
  const b = Math.round(rgba1.b * w + rgba2.b * w2);
  const a = rgba1.a * w + rgba2.a * w2;

  return color({ r, g, b, a }, format);
}
