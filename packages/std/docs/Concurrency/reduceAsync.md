# reduceAsync

Asynchronous version of `Array.prototype.reduce`.
Runs iterations sequentially as each step depends on the previous accumulator.

Sparse array holes are skipped, and when no initial value is provided the first
present element becomes the accumulator, matching native
`Array.prototype.reduce()` behavior.

### Example

```js
await reduceAsync([1, 2, 3], async (acc, n) => acc + n, 0) //=> 6
```
