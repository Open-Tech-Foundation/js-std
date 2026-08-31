import type { ColorInput } from './color';
import colorContrast from './colorContrast';

/** A WCAG conformance level, at normal or at large text size. */
export type AccessibilityLevel = 'AA' | 'AAA' | 'AA_Large' | 'AAA_Large';

/** Options for `colorIsReadable`. */
export interface ColorIsReadableOptions {
  /** The first color. */
  color1: ColorInput;
  /** The second color. */
  color2: ColorInput;
  /** The WCAG level to check against. Defaults to `'AA'`. */
  level?: AccessibilityLevel;
}

/**
 * Checks if the contrast between two colors meets WCAG standards.
 *
 * @param {{ color1: ColorInput, color2: ColorInput, level?: AccessibilityLevel }} An object naming the two colors and the level.
 * @returns {boolean} Whether the colors are readable.
 */
export default function colorIsReadable(
  options: ColorIsReadableOptions,
): boolean {
  const level: AccessibilityLevel = options.level ?? 'AA';
  const ratio = colorContrast({
    color1: options.color1,
    color2: options.color2,
  });
  switch (level) {
    case 'AA':
      return ratio >= 4.5;
    case 'AA_Large':
      return ratio >= 3;
    case 'AAA':
      return ratio >= 7;
    case 'AAA_Large':
      return ratio >= 4.5;
    default:
      return false;
  }
}
