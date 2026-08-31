import clamp from '../maths/clamp';
import checkAmount from './checkAmount';
import color, {
  type ColorFormat,
  type ColorInput,
  type ColorOutput,
} from './color';

/** Options for `colorAlpha`. */
export interface ColorAlphaOptions<F extends ColorFormat = 'hex'> {
  /** The input color. */
  value: ColorInput;
  /** The alpha value (0 to 1). */
  amount: number;
  /** The output format. Defaults to `'hex'`. */
  to?: F;
}

/**
 * Adjusts the alpha channel of a color.
 *
 * @param {{ value: ColorInput, amount: number, to?: ColorFormat }} An object naming the value, the amount and the format.
 * @returns {ColorOutput} The color with adjusted alpha.
 * @throws {RangeError} If the amount is not a finite number.
 *
 * @example
 * colorAlpha({ value: 'red', amount: 0.5, to: 'rgba' }) //=> 'rgba(255, 0, 0, 0.5)'
 */
export default function colorAlpha<F extends ColorFormat = 'hex'>(
  options: ColorAlphaOptions<F>,
): ColorOutput<F>;
export default function colorAlpha(
  options: ColorAlphaOptions<ColorFormat>,
): ColorOutput {
  const { value, amount } = options;
  const to: ColorFormat = options.to ?? 'hex';
  checkAmount(amount, 'amount');

  const rgba = color({ value, to: 'rgba-object' });
  rgba.a = clamp(amount, 0, 1);
  return color({ value: rgba, to });
}
