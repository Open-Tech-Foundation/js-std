# colorAlpha

Adjusts the alpha channel of a color.

## Parameters

- **input** `ColorInput` — The input color.
- **amount** `number` — The alpha value (0 to 1).
- **format** `ColorFormat` _(default: `'hex'`)_ — The output format.

## Returns

`ColorOutput` — The color with adjusted alpha.

## Example

```js
colorAlpha('red', 0.5, 'rgba') //=> 'rgba(255, 0, 0, 0.5)'
```
