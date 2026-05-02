# reduceIterAsync

Accumulates values from an async iterator using a reducer function.

@param {AsyncIterable<T>} iter The async iterable to reduce.
@param {(acc: U, val: T) => U | Promise<U>} fn The reducer function.
@param {U} initialValue The initial value for the accumulator.
@returns {Promise<U>} A promise that resolves to the final accumulator value.

### Example

```js
async function* gen() { yield 1; yield 2; yield 3; }
await reduceIterAsync(gen(), (acc, x) => acc + x, 0) //=> 6
```
