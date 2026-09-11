# colorAlpha

Adjusts the alpha channel of a color.

## Parameters

- **An** `{ value: ColorInput, amount: number, to?: ColorFormat }` — object naming the value, the amount and the format.

## Returns

`ColorOutput` — The color with adjusted alpha.

## Throws

- `RangeError` — If the amount is not a finite number.

## Example

```js
colorAlpha({ value: 'red', amount: 0.5, to: 'rgba' }) //=> 'rgba(255, 0, 0, 0.5)'
```
