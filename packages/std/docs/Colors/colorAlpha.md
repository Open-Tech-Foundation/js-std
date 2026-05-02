# colorAlpha

Adjusts the alpha channel of a color.

@param {ColorInput} input The input color.
@param {number} amount The alpha value (0 to 1).
@param {ColorFormat} [format='hex'] The output format.
@returns {string | number | object} The color with adjusted alpha.

### Example

```js
colorAlpha('red', 0.5, 'rgba') //=> 'rgba(255, 0, 0, 0.5)'
```
