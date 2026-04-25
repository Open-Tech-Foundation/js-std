import stripANSI from './stripANSI';

/**
 * Calculates the visual width of a string in a terminal.
 * Handles ANSI escape codes (0 width) and full-width characters (2 width).
 * Uses the native Intl.Segmenter for high-precision grapheme identification.
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

  const cleanStr = stripANSI(str);

  if (!globalThis.Intl || !globalThis.Intl.Segmenter) {
    throw new Error(
      'Intl.Segmenter is not supported in this environment. Use a polyfill or a modern runtime.'
    );
  }

  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  let width = 0;

  for (const { segment } of segmenter.segment(cleanStr)) {
    const codePoints = Array.from(segment).map((c) => c.codePointAt(0)!);
    const printable = codePoints.filter((cp) => !isIgnored(cp));

    if (printable.length === 0) {
      continue;
    }

    // A segment (grapheme cluster) should be at least width 1.
    // If it contains a full-width character or regional indicators, it's width 2.
    if (printable.some(isFullWidth)) {
      width += 2;
    } else {
      // For narrow segments, we count each printable character as 1.
      // This handles grouped narrow characters like half-width kana with marks.
      width += printable.length;
    }
  }

  return width;
}

function isIgnored(code: number): boolean {
  return (
    code <= 31 ||
    (code >= 127 && code <= 159) || // Control
    code === 0xad || // Soft hyphen
    (code >= 0x0300 && code <= 0x036f) || // Combining marks
    code === 0x200b ||
    code === 0x200c ||
    code === 0x200d ||
    code === 0xfeff || // Zero-width
    (code >= 0x2060 && code <= 0x206f) || // Variation selectors / Ignorable
    (code >= 0xfe00 && code <= 0xfe0f)
  );
}

function isFullWidth(code: number): boolean {
  return (
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
        (code >= 0xffe0 && code <= 0xffe6) || // Fullwidth Symbol Variants
        (code >= 0x20000 && code <= 0x2fffd) || // CJK Unified Ideographs Extension B .. Noncharacter
        (code >= 0x30000 && code <= 0x3fffd))) || // CJK Unified Ideographs Extension G .. Noncharacter
    (code >= 0x1f300 && code <= 0x1f64f) || // Emojis
    (code >= 0x1f900 && code <= 0x1f9ff) || // Supplemental Symbols and Pictographs
    (code >= 0x1f1e6 && code <= 0x1f1ff) // Regional Indicator Symbols (Flags)
  );
}
