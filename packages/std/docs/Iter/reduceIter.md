# reduceIter

Accumulates values from an iterator using a reducer function.

@param {Iterable<T>} iter The iterable to reduce.
@param {(acc: U, val: T) => U} fn The reducer function.
@param {U} initialValue The initial value for the accumulator.
@returns {U} The final accumulator value.

### Example

```js
reduceIter([1, 2, 3], (acc, x) => acc + x, 0) //=> 6
```
