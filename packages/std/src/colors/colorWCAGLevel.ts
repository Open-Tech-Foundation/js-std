import type { ColorInput } from './color';
import colorContrast from './colorContrast';

/**
 * Returns the WCAG conformance level for the contrast ratio between two colors.
 *
 * @param {ColorInput} color1 The first color.
 * @param {ColorInput} color2 The second color.
 * @returns {'A' | 'AA' | 'AAA' | 'FAIL'} The WCAG level.
 *
 * @example
 * colorWCAGLevel('#000', '#fff') //=> 'AAA'
 * colorWCAGLevel('#000', '#999') //=> 'FAIL'
 * colorWCAGLevel('#000', '#767676') //=> 'AA'
 * colorWCAGLevel('#000', '#595959') //=> 'A'
 */

export default function colorWCAGLevel(
  color1: ColorInput,
  color2: ColorInput,
): 'A' | 'AA' | 'AAA' | 'FAIL' {
  const ratio = colorContrast(color1, color2);

  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'A';
  return 'FAIL';
}
