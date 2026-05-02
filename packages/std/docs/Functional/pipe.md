# pipe

Performs left-to-right function composition.

@param {Function[]} fns The functions to pipe.
@returns {Function} A new function that pipes its arguments.

### Example

```js
const addAbs = pipe((a, b) => a + b, Math.abs);
addAbs(-2, -3) //=> 5
```
