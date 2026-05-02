import type { ColorInput } from './color';
import colorContrast from './colorContrast';

type AccessibilityLevel = 'AA' | 'AAA' | 'AA_Large' | 'AAA_Large';

/**
 * Checks if the contrast between two colors meets WCAG standards.
 *
 * @param {ColorInput} color1 - The first color.
 * @param {ColorInput} color2 - The second color.
 * @param {AccessibilityLevel} level - The WCAG level to check against (default: 'AA').
 * @returns {boolean} - Whether the colors are readable.
 */
export default function colorIsReadable(
  color1: ColorInput,
  color2: ColorInput,
  level: AccessibilityLevel = 'AA',
): boolean {
  const ratio = colorContrast(color1, color2);
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
