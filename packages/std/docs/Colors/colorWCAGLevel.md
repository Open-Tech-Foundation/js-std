# colorWCAGLevel

Returns the WCAG conformance level for the contrast ratio between two colors.

## Parameters

- **color1** `ColorInput` — The first color.
- **color2** `ColorInput` — The second color.

## Returns

`'A' | 'AA' | 'AAA' | 'FAIL'` — The WCAG level.

## Example

```js
colorWCAGLevel('#000', '#fff') //=> 'AAA'
colorWCAGLevel('#000', '#999') //=> 'FAIL'
colorWCAGLevel('#000', '#767676') //=> 'AA'
colorWCAGLevel('#000', '#595959') //=> 'A'
```
