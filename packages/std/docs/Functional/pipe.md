# pipe

Performs left-to-right function composition.

## Parameters

- **fns** `Function[]` — The functions to pipe.

## Returns

`Function` — A new function that pipes its arguments.

## Example

```js
const addAbs = pipe((a, b) => a + b, Math.abs);
addAbs(-2, -3) //=> 5
```
