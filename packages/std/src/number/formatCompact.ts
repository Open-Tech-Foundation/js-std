/**
 * Formats a number in compact form (e.g., 1.2K, 1.2M).
 *
 * @param {number} value The number to format.
 * @param {object} options The options object.
 * @param {string} options.display The display format: 'short' or 'long' (default 'short').
 * @param {string} options.locale The locale (default runtime locale).
 * @param {number} options.fractionDigits The maximum fraction digits.
 * @returns {string} The formatted compact number string.
 *
 * @example
 * formatCompact(1200) //=> '1.2K'
 * formatCompact(1200000) //=> '1.2M'
 * formatCompact(1200000000) //=> '1.2B'
 * formatCompact(1200, { display: 'long' }) //=> '1.2 thousand'
 * formatCompact(1200000, { display: 'long' }) //=> '1.2 million'
 * formatCompact(1234, { fractionDigits: 2 }) //=> '1.23K'
 * formatCompact(1200, { locale: 'de-DE' }) //=> '1,2 Tsd.'
 * formatCompact(1200, { locale: 'ja-JP' }) //=> '1.2千'
 */

interface FormatCompactOptions {
  display?: 'short' | 'long';
  locale?: string;
  fractionDigits?: number;
}

function validateDisplay(display: string): void {
  if (display !== 'short' && display !== 'long') {
    throw new RangeError(
      "The display option must be either 'short' or 'long'.",
    );
  }
}

function validateFractionDigits(fractionDigits: number): void {
  if (
    !Number.isInteger(fractionDigits) ||
    fractionDigits < 0 ||
    fractionDigits > 100
  ) {
    throw new RangeError(
      'The fractionDigits option must be an integer between 0 and 100.',
    );
  }
}

export default function formatCompact(
  value: number,
  options: FormatCompactOptions = {},
): string {
  const { display = 'short', locale, fractionDigits } = options;

  validateDisplay(display);

  const intlOptions: Intl.NumberFormatOptions = {
    notation: 'compact',
    compactDisplay: display,
  };

  if (fractionDigits !== undefined) {
    validateFractionDigits(fractionDigits);
    intlOptions.minimumFractionDigits = fractionDigits;
    intlOptions.maximumFractionDigits = fractionDigits;
  }

  const formatter = new Intl.NumberFormat(locale, intlOptions);
  return formatter.format(value);
}
