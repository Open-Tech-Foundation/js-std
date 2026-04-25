# composeFn

Returns a function that performs functions composition from right to left.

### Example

```js
const transform = composeFn(Math.abs, Math.pow);
transform(-2, 3) //=> 8
```
