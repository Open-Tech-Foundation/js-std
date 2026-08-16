# union

Returns unique values in all the given collections.

## Parameters

- **collections** `unknown[][]` — The arrays to union.
- **by** `Function` — The iteratee invoked per element.

## Returns

`unknown[]` — A new array of combined unique values.

## Example

```js
union([[1, 2], [2, 3]]) //=> [1, 2, 3]
```
