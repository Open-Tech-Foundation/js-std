/**
 * Refuses a non-finite adjustment amount.
 *
 * Every adjuster reaches arithmetic that turns `NaN` or an infinity into
 * something that is not a color, and each did it differently: the lightness,
 * saturation and mix paths produced the literal string `#NaNNaNNaN`, a hue
 * rotation produced `#333333` — a real color, but not the one passed in — and
 * an alpha of `NaN` was dropped, leaving the color opaque. A color string that
 * is not a color fails wherever it is finally used rather than where it was
 * made, so the amount is checked here instead.
 *
 * Infinities are refused alongside `NaN`. Some paths clamped them to a
 * sensible edge and others did not, and no caller means one.
 */
export default function checkAmount(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`The ${name} must be a finite number.`);
  }
}
