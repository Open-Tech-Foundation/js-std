# reduceAsync

Asynchronous version of `Array.prototype.reduce`.
Runs iterations sequentially as each step depends on the previous accumulator.

### Example

```js
await reduceAsync([1, 2, 3], async (acc, n) => acc + n, 0) //=> 6
```
