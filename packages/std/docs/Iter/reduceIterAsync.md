# reduceIterAsync

Accumulates values from an async iterator using a reducer function.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to reduce.
- **fn** `(acc: U, val: T) => U | Promise<U>` — The reducer function.
- **initialValue** `U` — The initial value for the accumulator.

## Returns

`Promise<U>` — A promise that resolves to the final accumulator value.

## Example

```js
async function* gen() { yield 1; yield 2; yield 3; }
await reduceIterAsync(gen(), (acc, x) => acc + x, 0) //=> 6
```
