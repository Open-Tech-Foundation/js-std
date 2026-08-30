# colorRotateHue

Rotates the hue of a color.

## Parameters

- **input** `ColorInput` — The input color.
- **degrees** `number` — The degrees to rotate (can be negative).
- **format** `ColorFormat` _(default: `'hex'`)_ — The output format.

## Returns

`ColorOutput` — The hue-rotated color.

## Throws

- `RangeError` — If the degrees is not a finite number.
