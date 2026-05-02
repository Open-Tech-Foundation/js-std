# toArrayIter

Collects all items from an iterator into an array.

@param {Iterable<T>} iter The iterable to collect.
@returns {T[]} An array of all items.

### Example

```js
toArrayIter((function*() { yield 1; yield 2; })()) //=> [1, 2]
```
