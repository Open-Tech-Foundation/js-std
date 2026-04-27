# mapAsync

Asynchronous version of `Array.prototype.map`.

## Syntax

```ts
import { mapAsync } from '@opentf/std';

mapAsync
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| cb | `Function` | The async callback to run for each element. |

## Returns

`Promise<R[]>`: A promise that resolves to the new array.

## Example

```js
await mapAsync([1, 2, 3], async (n) => n * 2) //=> [2, 4, 6]
```
