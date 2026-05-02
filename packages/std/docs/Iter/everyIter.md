# everyIter

Checks if all items in an iterator match a predicate.

@param {Iterable<T>} iter The iterable to check.
@param {(val: T) => boolean} fn The predicate function.
@returns {boolean} True if all items match, else false.

### Example

```js
everyIter([1, 2, 3], x => x > 0) //=> true
```
