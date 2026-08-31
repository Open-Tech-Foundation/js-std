import type { ColorInput } from './color';
import colorContrast from './colorContrast';

/** Options for `colorWCAGLevel`. */
export interface ColorWCAGLevelOptions {
  /** The first color. */
  color1: ColorInput;
  /** The second color. */
  color2: ColorInput;
}

/**
 * Returns the WCAG conformance level for the contrast ratio between two colors.
 *
 * @param {{ color1: ColorInput, color2: ColorInput }} An object naming the two colors.
 * @returns {'A' | 'AA' | 'AAA' | 'FAIL'} The WCAG level.
 *
 * @example
 * colorWCAGLevel({ color1: '#000', color2: '#fff' }) //=> 'AAA'
 * colorWCAGLevel({ color1: '#000', color2: '#999' }) //=> 'FAIL'
 * colorWCAGLevel({ color1: '#000', color2: '#767676' }) //=> 'AA'
 * colorWCAGLevel({ color1: '#000', color2: '#595959' }) //=> 'A'
 */

export default function colorWCAGLevel(
  options: ColorWCAGLevelOptions,
): 'A' | 'AA' | 'AAA' | 'FAIL' {
  const ratio = colorContrast({
    color1: options.color1,
    color2: options.color2,
  });

  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'A';
  return 'FAIL';
}
