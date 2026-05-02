# dropIter

Returns a Generator that skips the first n items from an Iterable.

@param {Iterable} iterable The source iterable.
@param {number} n The number of items to skip.
@returns {Generator} A new generator with the remaining items.

### Example

```js
const it = dropIter([1, 2, 3], 1);
[...it] //=> [2, 3]
```
