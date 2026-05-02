# someIter

Checks if any item in an iterator matches a predicate.

@param {Iterable<T>} iter The iterable to check.
@param {(val: T) => boolean} fn The predicate function.
@returns {boolean} True if any item matches, else false.

### Example

```js
someIter([1, 2, 3], x => x > 1) //=> true
```
