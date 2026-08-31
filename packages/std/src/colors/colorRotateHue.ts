import checkAmount from './checkAmount';
import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/** Options for `colorRotateHue`. */
export interface ColorRotateHueOptions<F extends ColorFormat = 'hex'> {
  /** The input color. */
  value: ColorInput;
  /** The degrees to rotate (can be negative). */
  degrees: number;
  /** The output format. Defaults to `'hex'`. */
  to?: F;
}

/**
 * Rotates the hue of a color.
 *
 * @param {{ value: ColorInput, degrees: number, to?: ColorFormat }} An object naming the value, the degrees and the format.
 * @returns {ColorOutput} The hue-rotated color.
 * @throws {RangeError} If the degrees is not a finite number.
 */
export default function colorRotateHue<F extends ColorFormat = 'hex'>(
  options: ColorRotateHueOptions<F>,
): ColorOutput<F>;
export default function colorRotateHue(
  options: ColorRotateHueOptions<ColorFormat>,
): ColorOutput {
  const { value, degrees } = options;
  const to: ColorFormat = options.to ?? 'hex';
  checkAmount(degrees, 'degrees');

  const hsla = color({ value, to: 'hsla-object' });
  hsla.h = (hsla.h + degrees) % 360;
  if (hsla.h < 0) hsla.h += 360;
  return color({ value: hsla, to });
}
