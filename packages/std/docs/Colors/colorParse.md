# colorParse

Parses a color string into an RGBA object.
Supports hex, rgb, rgba, hsl, hsla.

### Example

```js

colorParse('#ff0000') //=> { r: 255, g: 0, b: 0, a: 1 }

colorParse('rgb(255, 0, 0)') //=> { r: 255, g: 0, b: 0, a: 1 }
```
