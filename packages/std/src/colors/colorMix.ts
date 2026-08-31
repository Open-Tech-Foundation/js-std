import checkAmount from './checkAmount';
import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/** Options for `colorMix`. */
export interface ColorMixOptions<F extends ColorFormat = 'hex'> {
  /** The first color. */
  color1: ColorInput;
  /** The second color. */
  color2: ColorInput;
  /** The weight of the first color (0 to 1). Defaults to `0.5`. */
  weight?: number;
  /** The output format. Defaults to `'hex'`. */
  to?: F;
}

/**
 * Mixes two colors together.
 *
 * @param {{ color1: ColorInput, color2: ColorInput, weight?: number, to?: ColorFormat }} An object naming the two colors, the weight and the format.
 * @returns {ColorOutput} The mixed color.
 * @throws {RangeError} If the weight is not a finite number.
 */
export default function colorMix<F extends ColorFormat = 'hex'>(
  options: ColorMixOptions<F>,
): ColorOutput<F>;
export default function colorMix(
  options: ColorMixOptions<ColorFormat>,
): ColorOutput {
  const { color1, color2 } = options;
  const weight = options.weight ?? 0.5;
  const to: ColorFormat = options.to ?? 'hex';
  checkAmount(weight, 'weight');

  const rgba1 = color({ value: color1, to: 'rgba-object' });
  const rgba2 = color({ value: color2, to: 'rgba-object' });

  const w = weight;
  const w2 = 1 - w;

  const r = Math.round(rgba1.r * w + rgba2.r * w2);
  const g = Math.round(rgba1.g * w + rgba2.g * w2);
  const b = Math.round(rgba1.b * w + rgba2.b * w2);
  const a = rgba1.a * w + rgba2.a * w2;

  return color({ value: { r, g, b, a }, to });
}
