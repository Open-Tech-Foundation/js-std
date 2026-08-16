# keyBy

Indexes an array by a key, giving one element per key.

This is the one-to-one counterpart of `groupBy`, for turning a list into a
lookup table: `groupBy` collects every match into an array, `keyBy` keeps a
single element. When two elements produce the same key the later one wins,
so pass a list already ordered oldest-first to keep the newest.

A key of `__proto__`, `constructor` or `prototype` is refused and its
element dropped: the lookup is built from data, and writing one of those
would make the element the prototype of the table instead of an entry in it.

## Parameters

- **arr** `T[]` — The source array.
- **by** `Function|string` — The iteratee, or the name of a property to read.

## Returns

`Record<string, T>` — The lookup table.

## Examples

```js
const users = [{ id: 'a1', name: 'Ada' }, { id: 'b2', name: 'Linus' }];
keyBy(users, 'id') //=> { a1: { id: 'a1', ... }, b2: { id: 'b2', ... } }
```

```js
keyBy([6.1, 4.2], Math.floor) //=> { '4': 4.2, '6': 6.1 }
```
