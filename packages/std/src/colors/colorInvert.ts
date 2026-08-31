import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/** Options for `colorInvert`. */
export interface ColorInvertOptions<F extends ColorFormat = 'hex'> {
  /** The input color. */
  value: ColorInput;
  /** The output format. Defaults to `'hex'`. */
  to?: F;
}

/**
 * Inverts a color.
 *
 * @param {{ value: ColorInput, to?: ColorFormat }} An object naming the value and the format.
 * @returns {ColorOutput} The inverted color.
 */
export default function colorInvert<F extends ColorFormat = 'hex'>(
  options: ColorInvertOptions<F>,
): ColorOutput<F>;
export default function colorInvert(
  options: ColorInvertOptions<ColorFormat>,
): ColorOutput {
  const { value } = options;
  const to: ColorFormat = options.to ?? 'hex';

  const rgba = color({ value, to: 'rgba-object' });
  return color({
    value: {
      r: 255 - rgba.r,
      g: 255 - rgba.g,
      b: 255 - rgba.b,
      a: rgba.a,
    },
    to,
  });
}
