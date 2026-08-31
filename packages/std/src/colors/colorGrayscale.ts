import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/** Options for `colorGrayscale`. */
export interface ColorGrayscaleOptions<F extends ColorFormat = 'hex'> {
  /** The input color. */
  value: ColorInput;
  /** The output format. Defaults to `'hex'`. */
  to?: F;
}

/**
 * Converts a color to grayscale.
 *
 * @param {{ value: ColorInput, to?: ColorFormat }} An object naming the value and the format.
 * @returns {ColorOutput} The grayscale color.
 */
export default function colorGrayscale<F extends ColorFormat = 'hex'>(
  options: ColorGrayscaleOptions<F>,
): ColorOutput<F>;
export default function colorGrayscale(
  options: ColorGrayscaleOptions<ColorFormat>,
): ColorOutput {
  const { value } = options;
  const to: ColorFormat = options.to ?? 'hex';

  const hsla = color({ value, to: 'hsla-object' });
  hsla.s = 0;
  return color({ value: hsla, to });
}
