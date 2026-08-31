# colorLighten

Increases the lightness of a color.

## Parameters

- **value** `ColorInput` — The input color.
- **amount** `number` — The amount to lighten (0 to 1).
- **to** `ColorFormat` _(default: `'hex'`)_ — The output format.

## Returns

`ColorOutput` — The lightened color.

## Throws

- `RangeError` — If the amount is not a finite number.
