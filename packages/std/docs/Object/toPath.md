# toPath

Converts the given value into an object property path array.

A number or a symbol is a single-segment path, and anything else has no
segments at all, so it yields an empty array.

@param {PropertyPath|number|symbol} val The value to convert.
@returns {unknown[]} The path segments.

### Example

```js
toPath('a.b.c') //=> ['a', 'b', 'c']
```
