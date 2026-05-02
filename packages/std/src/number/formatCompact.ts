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

export default function formatCompact(
  value: number,
  options: FormatCompactOptions = {},
): string {
  const { display = 'short', locale, fractionDigits } = options;

  const intlOptions: Intl.NumberFormatOptions = {
    notation: 'compact',
    compactDisplay: display === 'long' ? 'long' : 'short',
  };

  if (fractionDigits !== undefined) {
    intlOptions.minimumFractionDigits = fractionDigits;
    intlOptions.maximumFractionDigits = fractionDigits;
  }

  const formatter = new Intl.NumberFormat(locale, intlOptions);
  return formatter.format(value);
}
