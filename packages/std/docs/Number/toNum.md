# toNum

Converts the given value into a finite number.

@param {unknown} val The value to convert.
@returns {number} The converted number or NaN.

Supports numeric separators in valid positions. Invalid separator placements such
as `1_e2` or `1._5` return `NaN`.

### Example

```js
toNum('1.5') //=> 1.5
toNum('1_000') //=> 1000
toNum('0xF_F') //=> 255
```
