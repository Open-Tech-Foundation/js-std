# countIter

Returns the total count of items in an iterable.

@param {Iterable<unknown>} iter The iterable to count.
@returns {number} The total count of items.

### Example

```js
countIter((function*() { yield 1; yield 2; })()) //=> 2
```
