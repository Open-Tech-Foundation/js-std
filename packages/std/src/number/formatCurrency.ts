/**
 * Formats a number as a currency string using Intl.NumberFormat.
 *
 * @param {number} value The number to format.
 * @param {string} currency The ISO 4217 currency code (e.g., 'USD', 'EUR').
 * @param {object} options The options object.
 * @param {string} options.display The display format: 'symbol', 'code', or 'name' (default 'symbol').
 * @param {number} options.minFraction The minimum fraction digits.
 * @param {number} options.maxFraction The maximum fraction digits.
 * @param {string} options.locale The locale (default runtime locale).
 * @returns {string} The formatted currency string.
 *
 * @example
 * formatCurrency(1200, 'USD') //=> '$1,200.00'
 * formatCurrency(1200, 'EUR') //=> '€1,200.00'
 * formatCurrency(1200, 'JPY') //=> '¥1,200'
 * formatCurrency(1200, 'INR') //=> '₹1,200.00'
 * formatCurrency(1200, 'EUR', { locale: 'de-DE' }) //=> '1.200,00 €'
 * formatCurrency(1200, 'USD', { display: 'code' }) //=> 'USD 1,200.00'
 * formatCurrency(1200, 'USD', { display: 'name' }) //=> '1,200.00 US dollars'
 * formatCurrency(1200, 'USD', { maxFraction: 0 }) //=> '$1,200'
 */

interface FormatCurrencyOptions {
  display?: 'symbol' | 'code' | 'name';
  minFraction?: number;
  maxFraction?: number;
  locale?: string;
}

const DISPLAY_MAP: Record<string, string> = {
  symbol: 'symbol',
  code: 'code',
  name: 'name',
};

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

export default function formatCurrency(
  value: number,
  currency: string,
  options: FormatCurrencyOptions = {},
): string {
  const { display = 'symbol', minFraction, maxFraction, locale } = options;

  if (!/^[A-Za-z]{3}$/.test(currency)) {
    throw new RangeError(
      'The currency code must be a 3-letter ISO 4217 string.',
    );
  }

  const intlOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    currencyDisplay: DISPLAY_MAP[
      display
    ] as Intl.NumberFormatOptions['currencyDisplay'],
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

  const formatter = new Intl.NumberFormat(locale, intlOptions);
  return formatter.format(value);
}
