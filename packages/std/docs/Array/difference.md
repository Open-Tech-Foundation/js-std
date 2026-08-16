# difference

Creates an array with the values of the first array not included in the other arrays.

## Parameters

- **collections** `unknown[][]` — The arrays to compare.
- **by** `Function` — The iteratee invoked per element.

## Returns

`unknown[]` — A new array of filtered values.

## Example

```js
difference([[1, 2], [2, 3]]) //=> [1]
difference([[1, "a"], [1, 2]]) //=> ['a']
```
