# colorContrast

Calculates the contrast ratio between two colors.

## Parameters

- **color1** `ColorInput` — The first color.
- **color2** `ColorInput` — The second color.

## Returns

`number` — The contrast ratio (1 to 21).

## Example

```js
colorContrast({ color1: '#fff', color2: '#000' }) //=> 21
```
