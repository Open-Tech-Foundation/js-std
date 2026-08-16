# formatCompact

Formats a number in compact form (e.g., 1.2K, 1.2M).

## Parameters

- **value** `number` — The number to format.
- **options** `object` — The options object.
  - **options.display** `string` — The display format: 'short' or 'long' (default 'short').
  - **options.locale** `string` — The locale (default runtime locale).
  - **options.fractionDigits** `number` — The maximum fraction digits.

## Returns

`string` — The formatted compact number string.

## Example

```js
formatCompact(1200) //=> '1.2K'
formatCompact(1200000) //=> '1.2M'
formatCompact(1200000000) //=> '1.2B'
formatCompact(1200, { display: 'long' }) //=> '1.2 thousand'
formatCompact(1200000, { display: 'long' }) //=> '1.2 million'
formatCompact(1234, { fractionDigits: 2 }) //=> '1.23K'
formatCompact(1200, { locale: 'de-DE' }) //=> '1,2 Tsd.'
formatCompact(1200, { locale: 'ja-JP' }) //=> '1.2千'
```
