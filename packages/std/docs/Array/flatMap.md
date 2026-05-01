# flatMap

Maps each item and flattens the result into a single array.

## Syntax

```ts
import { flatMap } from '@opentf/std';

flatMap<T, U>(arr: T[] = [], fn: (val: T, index: number, arr: T[]) => U[] | Iterable<U>): U[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| fn | `Function` | The mapper function returning arrays. |

## Returns

`U[]`: A new flattened array.

## Example

```js
flatMap([1, 2], (x) => [x, x * 10]) //=> [1, 10, 2, 20]
flatMap([1, 2, 3], (x) => [x]) //=> [1, 2, 3]
```
