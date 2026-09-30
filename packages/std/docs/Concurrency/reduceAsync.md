<!-- handwritten -->

# reduceAsync

Asynchronous version of `Array.prototype.reduce`.
Runs iterations sequentially as each step depends on the previous accumulator.

Sparse array holes are skipped, and when no initial value is provided the first
present element becomes the accumulator, matching native
`Array.prototype.reduce()` behavior.

Pass the initial value in a third-argument options object as `{ initialValue }`.

## Example

```js
await reduceAsync([1, 2, 3], async (acc, n) => acc + n, { initialValue: 0 }) //=> 6
```
