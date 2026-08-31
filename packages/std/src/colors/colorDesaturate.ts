import checkAmount from './checkAmount';
import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/** Options for `colorDesaturate`. */
export interface ColorDesaturateOptions<F extends ColorFormat = 'hex'> {
  /** The input color. */
  value: ColorInput;
  /** The amount to desaturate (0 to 1). */
  amount: number;
  /** The output format. Defaults to `'hex'`. */
  to?: F;
}

/**
 * Decreases the saturation of a color.
 *
 * @param {{ value: ColorInput, amount: number, to?: ColorFormat }} An object naming the value, the amount and the format.
 * @returns {ColorOutput} The desaturated color.
 * @throws {RangeError} If the amount is not a finite number.
 */
export default function colorDesaturate<F extends ColorFormat = 'hex'>(
  options: ColorDesaturateOptions<F>,
): ColorOutput<F>;
export default function colorDesaturate(
  options: ColorDesaturateOptions<ColorFormat>,
): ColorOutput {
  const { value, amount } = options;
  const to: ColorFormat = options.to ?? 'hex';
  checkAmount(amount, 'amount');

  const hsla = color({ value, to: 'hsla-object' });
  hsla.s = Math.max(0, hsla.s - amount * 100);
  return color({ value: hsla, to });
}
