# mapAsync

Asynchronous version of `Array.prototype.map`.

## Parameters

- **arr** `T[]` — The source array.
- **cb** `Function` — The async callback to run for each element.
- **options** `{ concurrency?: number }` — The maximum number of concurrent executions. Defaults to `Infinity`.

## Returns

`Promise<R[]>` — A promise that resolves to the new array.

## Example

```js
await mapAsync([1, 2, 3], async (n) => n * 2) //=> [2, 4, 6]
await mapAsync([1, 2, 3], async (n) => n * 2, { concurrency: 2 }) //=> [2, 4, 6]
```
