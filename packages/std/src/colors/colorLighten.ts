import checkAmount from './checkAmount';
import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/** Options for `colorLighten`. */
export interface ColorLightenOptions<F extends ColorFormat = 'hex'> {
  /** The input color. */
  value: ColorInput;
  /** The amount to lighten (0 to 1). */
  amount: number;
  /** The output format. Defaults to `'hex'`. */
  to?: F;
}

/**
 * Increases the lightness of a color.
 *
 * @param {{ value: ColorInput, amount: number, to?: ColorFormat }} An object naming the value, the amount and the format.
 * @returns {ColorOutput} The lightened color.
 * @throws {RangeError} If the amount is not a finite number.
 */
export default function colorLighten<F extends ColorFormat = 'hex'>(
  options: ColorLightenOptions<F>,
): ColorOutput<F>;
export default function colorLighten(
  options: ColorLightenOptions<ColorFormat>,
): ColorOutput {
  const { value, amount } = options;
  const to: ColorFormat = options.to ?? 'hex';
  checkAmount(amount, 'amount');

  const hsla = color({ value, to: 'hsla-object' });
  hsla.l = Math.min(100, hsla.l + amount * 100);
  return color({ value: hsla, to });
}
