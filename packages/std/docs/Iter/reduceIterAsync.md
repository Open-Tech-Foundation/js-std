# reduceIterAsync

Accumulates values from an async iterator using a reducer function.

Pass the initial accumulator in the third-argument options object as
`{ initialValue }`.

## Parameters

- **iter** `AsyncIterable<T>` — The async iterable to reduce.
- **fn** `(acc: U, val: T) => U | Promise<U>` — The reducer function.
- **options** `{ initialValue: U }` — The initial value for the accumulator.

## Returns

`Promise<U>` — A promise that resolves to the final accumulator value.

## Example

```js
async function* gen() { yield 1; yield 2; yield 3; }
await reduceIterAsync(gen(), (acc, x) => acc + x, { initialValue: 0 }) //=> 6
```
