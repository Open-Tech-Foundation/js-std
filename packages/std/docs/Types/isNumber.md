# isNumber

Checks if the given value is a finite number.

@param {unknown} val The value to check.
@param {boolean} [coerce=false] Whether to coerce strings to numbers.
@returns {boolean} True if the value is a number, false otherwise.

### Example

```js
isNumber(1) //=> true
isNumber('1', true) //=> true
```
