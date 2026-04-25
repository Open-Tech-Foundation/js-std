# pipeFn

Returns a function that performs functions composition from left to right.

### Example

```js
const transform = pipeFn(Math.pow, Math.abs)
transform(-2, 3) //=> 8
```
