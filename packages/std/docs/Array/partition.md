# partition

Creates an array of elements split into two groups: those that pass the predicate and those that don't.

## Syntax

```ts
import { partition } from '@opentf/std';

partition<T>(arr: T[] = [], predicate: (val: T, index: number, arr: T[]) => boolean): [T[], T[]]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| predicate | `Function` | The function invoked per element. |

## Returns

`[T[], T[]]`: A tuple of `[passing, failing]` arrays.

## Example

```js
partition([1, 2, 3, 4, 5], (n) => n % 2 === 0) //=> [[2, 4], [1, 3, 5]]
partition([0, 1, false, 2, '', 3], Boolean) //=> [[1, 2, 3], [0, false, '']]
```
