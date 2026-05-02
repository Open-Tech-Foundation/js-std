# color

Parses and converts colors between various formats.

@param {string|number|Array|Object} input The color input.
@param {string} format The output format.
@returns {string|number|Array|Object} The converted color.

### Example

```js
color('#ff0000', 'rgb') //=> 'rgb(255, 0, 0)'
color('red', 'rgba-object') //=> { r: 255, g: 0, b: 0, a: 1 }
color({ h: 0, s: 100, l: 50 }, 'hex') //=> '#ff0000'
```
