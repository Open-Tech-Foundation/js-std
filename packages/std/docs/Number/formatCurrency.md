# formatCurrency

Formats a number as a currency string using Intl.NumberFormat.

@param {number} value The number to format.
@param {string} currency The ISO 4217 currency code (e.g., 'USD', 'EUR').
@param {object} options The options object.
@param {string} options.display The display format: 'symbol', 'code', or 'name' (default 'symbol').
@param {number} options.minFraction The minimum fraction digits.
@param {number} options.maxFraction The maximum fraction digits.
@param {string} options.locale The locale (default runtime locale).
@returns {string} The formatted currency string.

### Example

```js
formatCurrency(1200, 'USD') //=> '$1,200.00'
formatCurrency(1200, 'EUR') //=> '€1,200.00'
formatCurrency(1200, 'JPY') //=> '¥1,200'
formatCurrency(1200, 'INR') //=> '₹1,200.00'
formatCurrency(1200, 'EUR', { locale: 'de-DE' }) //=> '1.200,00 €'
formatCurrency(1200, 'USD', { display: 'code' }) //=> 'USD 1,200.00'
formatCurrency(1200, 'USD', { display: 'name' }) //=> '1,200.00 US dollars'
formatCurrency(1200, 'USD', { maxFraction: 0 }) //=> '$1,200'
```
