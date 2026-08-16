# unique

Creates a duplicate-free version of an array, keeping first-seen order.

Primitive values are matched by identity, so `NaN` equals `NaN` and `-0`
equals `0`. Objects are compared structurally, so two separately built
objects of the same shape count as one — that comparison is quadratic in the
number of distinct objects, so pass a `by` returning a primitive when the
array is large.

How two values are compared depends on the values, not on whether `by` was
given: the same array deduplicates the same way with an identity iteratee as
without one.

## Parameters

- **arr** `T[]` — The source array.
- **by** `Function` _(optional)_ — The iteratee invoked per element to derive its key.

## Returns

`T[]` — A new duplicate-free array.

## Examples

```js
unique([1, 2, 2, 3]) //=> [1, 2, 3]
```

```js
unique([{ a: 1 }, { a: 1 }]) //=> [{ a: 1 }]
```

```js
const users = [{ id: 1 }, { id: 2 }, { id: 1 }];
unique(users, (u) => u.id) //=> [{ id: 1 }, { id: 2 }]
```
