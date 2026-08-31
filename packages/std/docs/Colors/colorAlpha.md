# colorAlpha

Adjusts the alpha channel of a color.

## Parameters

- **value** `ColorInput` — The input color.
- **amount** `number` — The alpha value (0 to 1).
- **to** `ColorFormat` _(default: `'hex'`)_ — The output format.

## Returns

`ColorOutput` — The color with adjusted alpha.

## Throws

- `RangeError` — If the amount is not a finite number.

## Example

```js
colorAlpha({ value: 'red', amount: 0.5, to: 'rgba' }) //=> 'rgba(255, 0, 0, 0.5)'
```
