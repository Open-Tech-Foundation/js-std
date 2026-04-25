import stripANSI from './stripANSI';

/**
 * Calculates the visual width of a string in a terminal.
 * Handles ANSI escape codes (0 width) and full-width characters (2 width).
 *
 * @example
 *
 * stringWidth('abc') //=> 3
 * stringWidth('\x1b[31mabc\x1b[0m') //=> 3
 * stringWidth('🔥') //=> 2
 * stringWidth('こんにちは') //=> 10
 */
export default function stringWidth(str: string): number {
  if (typeof str !== 'string' || str.length === 0) {
    return 0;
  }

  // Remove ANSI escape codes
  const cleanStr = stripANSI(str);

  let width = 0;
  for (let i = 0; i < cleanStr.length; i++) {
    const code = cleanStr.charCodeAt(i);

    // High surrogate pair handling
    if (code >= 0xd800 && code <= 0xdbff) {
      const nextCode = cleanStr.charCodeAt(i + 1);
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        // Full emoji or surrogate pair usually takes 2 columns
        width += 2;
        i++;
        continue;
      }
    }

    // CJK and other full-width ranges
    if (
      (code >= 0x1100 &&
        (code <= 0x115f || // Hangul Jamo
          code === 0x2329 || // LEFT-POINTING ANGLE BRACKET
          code === 0x232a || // RIGHT-POINTING ANGLE BRACKET
          (code >= 0x2e80 && code <= 0xa4cf && code !== 0x303f) || // CJK Radicals Supplement .. Yi Radicals
          (code >= 0xac00 && code <= 0xd7a3) || // Hangul Syllables
          (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
          (code >= 0xfe10 && code <= 0xfe19) || // Vertical forms
          (code >= 0xfe30 && code <= 0xfe6f) || // CJK Compatibility Forms
          (code >= 0xff00 && code <= 0xff60) || // Fullwidth Forms
          (code >= 0xffe0 && code <= 0xffe6))) // Fullwidth Symbol Variants
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }

  return width;
}
