# colorWCAGLevel

Returns the WCAG conformance level for the contrast ratio between two colors.

@param {ColorInput} color1 The first color.
@param {ColorInput} color2 The second color.
@returns {'A' | 'AA' | 'AAA' | 'FAIL'} The WCAG level.

### Example

```js
colorWCAGLevel('#000', '#fff') //=> 'AAA'
colorWCAGLevel('#000', '#999') //=> 'FAIL'
colorWCAGLevel('#000', '#767676') //=> 'AA'
colorWCAGLevel('#000', '#595959') //=> 'A'
```
