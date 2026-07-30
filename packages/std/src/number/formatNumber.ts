/**
 * Formats a number for reading, with locale-aware grouping and rounding.
 *
 * The plain case the rest of the module builds on: `formatBytes`,
 * `formatCurrency` and `formatCompact` each format a number *as* something,
 * and this is the one that formats it as itself. Grouping separators and the
 * decimal mark follow the locale, so a German reader sees `1.234,5` where an
 * English one sees `1,234.5`.
 *
 * `style: 'percent'` multiplies by 100 and appends the locale's percent sign,
 * so `0.42` reads `42%` — the value is a ratio, not a number of percent.
 *
 * @param {number} value The number to format.
 * @param {object} [options] The options object.
 * @param {string} [options.style='decimal'] Either `'decimal'` or `'percent'`.
 * @param {string} [options.locale] The locale (default runtime locale).
 * @param {boolean} [options.grouping=true] Whether to group the thousands.
 * @param {number} [options.minFraction] The minimum fraction digits.
 * @param {number} [options.maxFraction] The maximum fraction digits.
 * @returns {string} The formatted number string.
 * @throws {RangeError} If an option is outside the range it allows.
 *
 * @example
 * formatNumber(1234567.891) //=> '1,234,567.891'
 * formatNumber(1234.5, { locale: 'de-DE' }) //=> '1.234,5'
 * formatNumber(1234.5, { grouping: false }) //=> '1234.5'
 *
 * @example
 * formatNumber(1234.5678, { maxFraction: 2 }) //=> '1,234.57'
 * formatNumber(7, { minFraction: 2 }) //=> '7.00'
 *
 * @example
 * formatNumber(0.42, { style: 'percent' }) //=> '42%'
 * formatNumber(0.4235, { style: 'percent', maxFraction: 1 }) //=> '42.4%'
 */

export interface FormatNumberOptions {
  style?: 'decimal' | 'percent';
  locale?: string;
  grouping?: boolean;
  minFraction?: number;
  maxFraction?: number;
}

function validateFractionDigits(
  value: number,
  optionName: 'minFraction' | 'maxFraction',
): void {
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new RangeError(
      `The ${optionName} option must be an integer between 0 and 100.`,
    );
  }
}

export default function formatNumber(
  value: number,
  options: FormatNumberOptions = {},
): string {
  const {
    style = 'decimal',
    locale,
    grouping = true,
    minFraction,
    maxFraction,
  } = options;

  if (style !== 'decimal' && style !== 'percent') {
    throw new RangeError(
      "The style option must be either 'decimal' or 'percent'.",
    );
  }

  const intlOptions: Intl.NumberFormatOptions = {
    style,
    useGrouping: grouping,
  };

  if (minFraction !== undefined) {
    validateFractionDigits(minFraction, 'minFraction');
    intlOptions.minimumFractionDigits = minFraction;
  }

  if (maxFraction !== undefined) {
    validateFractionDigits(maxFraction, 'maxFraction');
    intlOptions.maximumFractionDigits = maxFraction;
  }

  if (
    minFraction !== undefined &&
    maxFraction !== undefined &&
    minFraction > maxFraction
  ) {
    throw new RangeError(
      'The minFraction option must be less than or equal to maxFraction.',
    );
  }

  return new Intl.NumberFormat(locale, intlOptions).format(value);
}
