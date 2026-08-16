# mapAsync

Asynchronous version of `Array.prototype.map`.

## Parameters

- **arr** `T[]` — The source array.
- **cb** `Function` — The async callback to run for each element.
- **concurrency** `number` _(default: `Infinity`)_ — The maximum number of concurrent executions.

## Returns

`Promise<R[]>` — A promise that resolves to the new array.

## Example

```js
await mapAsync([1, 2, 3], async (n) => n * 2) //=> [2, 4, 6]
```
