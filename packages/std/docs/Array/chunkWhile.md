# chunkWhile

Splits an array into groups where consecutive elements satisfy the grouping predicate.

## Syntax

```ts
import { chunkWhile } from '@opentf/std';

chunkWhile<T>(arr: T[] = [], predicate: (curr: T, next: T, index: number, arr: T[]) => boolean): T[][]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| predicate | `Function` | The function that determines if two consecutive elements belong to the same chunk. |

## Returns

`T[][]`: A new array containing the chunks.

## Example

```js
chunkWhile([1, 2, 4, 5, 7], (a, b) => b - a < 2) //=> [[1, 2], [4, 5], [7]]
chunkWhile([1, 1, 2, 3, 5, 5, 6], (a, b) => a === b) //=> [[1, 1], [2], [3], [5, 5], [6]]
```
