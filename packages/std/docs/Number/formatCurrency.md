# formatCurrency

Formats a number as a currency string using Intl.NumberFormat.

## Parameters

- **value** `number` — The number to format.
- **currency** `string` — The ISO 4217 currency code (e.g., 'USD', 'EUR').
- **options** `object` — The options object.
  - **options.display** `string` — The display format: 'symbol', 'code', or 'name' (default 'symbol').
  - **options.minFraction** `number` — The minimum fraction digits.
  - **options.maxFraction** `number` — The maximum fraction digits.
  - **options.locale** `string` — The locale (default runtime locale).

## Returns

`string` — The formatted currency string.

## Example

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
