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

export default function formatCurrency(
  value: number,
  currency: string,
  options: FormatCurrencyOptions = {},
): string {
  const { display = 'symbol', minFraction, maxFraction, locale } = options;

  const intlOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    currencyDisplay: DISPLAY_MAP[
      display
    ] as Intl.NumberFormatOptions['currencyDisplay'],
  };

  if (minFraction !== undefined) {
    intlOptions.minimumFractionDigits = minFraction;
  }

  if (maxFraction !== undefined) {
    intlOptions.maximumFractionDigits = maxFraction;
  }

  const formatter = new Intl.NumberFormat(locale, intlOptions);
  return formatter.format(value);
}
