# colorRotateHue

Rotates the hue of a color.

## Parameters

- **value** `ColorInput` — The input color.
- **degrees** `number` — The degrees to rotate (can be negative).
- **to** `ColorFormat` _(default: `'hex'`)_ — The output format.

## Returns

`ColorOutput` — The hue-rotated color.

## Throws

- `RangeError` — If the degrees is not a finite number.
