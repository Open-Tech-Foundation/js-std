# reduceIter

Accumulates values from an iterator using a reducer function.

## Parameters

- **iter** `Iterable<T>` — The iterable to reduce.
- **fn** `(acc: U, val: T) => U` — The reducer function.
- **initialValue** `U` — The initial value for the accumulator.

## Returns

`U` — The final accumulator value.

## Example

```js
reduceIter([1, 2, 3], (acc, x) => acc + x, 0) //=> 6
```
