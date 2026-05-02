# clamp

Returns a value clamped to the inclusive range of min and max.

@param {number} val The value to clamp.
@param {number} min The lower bound.
@param {number} max The upper bound.
@returns {number} The clamped value.

### Example

```js
clamp(10, -5, 5) //=> 5
clamp(0, 1000, 1366) //=> 1000
```
