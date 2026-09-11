# colorContrast

Calculates the contrast ratio between two colors.

## Parameters

- **An** `{ color1: ColorInput, color2: ColorInput }` — object naming the two colors.

## Returns

`number` — The contrast ratio (1 to 21).

## Example

```js
colorContrast({ color1: '#fff', color2: '#000' }) //=> 21
```
