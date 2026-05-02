# compose

Returns a function that performs functions composition from right to left.
Supports both synchronous and asynchronous functions.
If any function in the chain returns a Promise, the remaining chain is awaited.

### Example

```js
const transform = compose(Math.abs, (x, y) => x + y);
transform(-2, -3) //=> 5
```
