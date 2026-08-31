# colorWCAGLevel

Returns the WCAG conformance level for the contrast ratio between two colors.

## Parameters

- **color1** `ColorInput` — The first color.
- **color2** `ColorInput` — The second color.

## Returns

`'A' | 'AA' | 'AAA' | 'FAIL'` — The WCAG level.

## Example

```js
colorWCAGLevel({ color1: '#000', color2: '#fff' }) //=> 'AAA'
colorWCAGLevel({ color1: '#000', color2: '#999' }) //=> 'FAIL'
colorWCAGLevel({ color1: '#000', color2: '#767676' }) //=> 'AA'
colorWCAGLevel({ color1: '#000', color2: '#595959' }) //=> 'A'
```
