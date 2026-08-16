# formatNumber

Formats a number for reading, with locale-aware grouping and rounding.

The plain case the rest of the module builds on: `formatBytes`,
`formatCurrency` and `formatCompact` each format a number *as* something,
and this is the one that formats it as itself. Grouping separators and the
decimal mark follow the locale, so a German reader sees `1.234,5` where an
English one sees `1,234.5`.

`style: 'percent'` multiplies by 100 and appends the locale's percent sign,
so `0.42` reads `42%` — the value is a ratio, not a number of percent.

## Parameters

- **value** `number` — The number to format.
- **options** `object` _(optional)_ — The options object.
  - **options.style** `string` _(default: `'decimal'`)_ — Either `'decimal'` or `'percent'`.
  - **options.locale** `string` _(optional)_ — The locale (default runtime locale).
  - **options.grouping** `boolean` _(default: `true`)_ — Whether to group the thousands.
  - **options.minFraction** `number` _(optional)_ — The minimum fraction digits.
  - **options.maxFraction** `number` _(optional)_ — The maximum fraction digits.

## Returns

`string` — The formatted number string.

## Throws

- `RangeError` — If an option is outside the range it allows.

## Examples

```js
formatNumber(1234567.891) //=> '1,234,567.891'
formatNumber(1234.5, { locale: 'de-DE' }) //=> '1.234,5'
formatNumber(1234.5, { grouping: false }) //=> '1234.5'
```

```js
formatNumber(1234.5678, { maxFraction: 2 }) //=> '1,234.57'
formatNumber(7, { minFraction: 2 }) //=> '7.00'
```

```js
formatNumber(0.42, { style: 'percent' }) //=> '42%'
formatNumber(0.4235, { style: 'percent', maxFraction: 1 }) //=> '42.4%'
```
