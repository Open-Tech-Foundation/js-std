# keyBy

Indexes an array by a key, giving one element per key.

This is the one-to-one counterpart of `groupBy`, for turning a list into a lookup table: `groupBy` collects every match into an array, `keyBy` keeps a single element. When two elements produce the same key the later one wins, so pass a list already ordered oldest-first to keep the newest.

@param arr - The source array.
@param by - The iteratee, or the name of a property to read.
@returns The lookup table.

### Example

```js
const users = [{ id: 'a1', name: 'Ada' }, { id: 'b2', name: 'Linus' }];
keyBy(users, 'id') //=> { a1: { id: 'a1', ... }, b2: { id: 'b2', ... } }

keyBy([6.1, 4.2], Math.floor) //=> { '4': 4.2, '6': 6.1 }
```
