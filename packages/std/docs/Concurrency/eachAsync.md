# eachAsync

Asynchronous version of `Array.prototype.forEach`. By default, it runs all iterations in parallel.

## Syntax

```ts
import { eachAsync } from '@opentf/std';

eachAsync<T>(arr: T[], cb: (value: T, index: number) => Promise<void>, concurrency: number = Infinity): Promise<void>
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| cb | `Function` | The callback to execute for each element. |
| concurrency | `number` | The maximum number of concurrent iterations. Defaults to `Infinity`. |

## Example

```js
await eachAsync([1, 2, 3], async (n) => console.log(n))
```

## Example

```js
await forEachAsync([1, 2, 3], async (n) => console.log(n))
```
