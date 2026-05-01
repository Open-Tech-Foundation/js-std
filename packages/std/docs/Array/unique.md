# unique

Creates a duplicate-free version of an array.

## Syntax

```ts
import { unique } from '@opentf/std';

unique<T>(arr: T[] = [], by?: (val: T) => unknown): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| by | `Function` | The iteratee invoked per element. |

## Returns

`T[]`: A new duplicate-free array.

## Example

```js
unique([1, 2, 2, 3]) //=> [1, 2, 3]
unique([2.1, 1.2, 2.3], Math.floor) //=> [2.1, 1.2]
```
