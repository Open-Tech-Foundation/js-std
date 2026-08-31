import checkAmount from './checkAmount';
import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/** Options for `colorSaturate`. */
export interface ColorSaturateOptions<F extends ColorFormat = 'hex'> {
  /** The input color. */
  value: ColorInput;
  /** The amount to saturate (0 to 1). */
  amount: number;
  /** The output format. Defaults to `'hex'`. */
  to?: F;
}

/**
 * Increases the saturation of a color.
 *
 * @param {{ value: ColorInput, amount: number, to?: ColorFormat }} An object naming the value, the amount and the format.
 * @returns {ColorOutput} The saturated color.
 * @throws {RangeError} If the amount is not a finite number.
 */
export default function colorSaturate<F extends ColorFormat = 'hex'>(
  options: ColorSaturateOptions<F>,
): ColorOutput<F>;
export default function colorSaturate(
  options: ColorSaturateOptions<ColorFormat>,
): ColorOutput {
  const { value, amount } = options;
  const to: ColorFormat = options.to ?? 'hex';
  checkAmount(amount, 'amount');

  const hsla = color({ value, to: 'hsla-object' });
  hsla.s = Math.min(100, hsla.s + amount * 100);
  return color({ value: hsla, to });
}
