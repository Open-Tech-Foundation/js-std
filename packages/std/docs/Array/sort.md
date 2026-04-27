# sort

Sorts an array of items.

## Syntax

```ts
import { sort } from '@opentf/std';

sort<T>(arr: T[] = [], order: OrderType = 'asc'): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |

## Returns

`T[]`: A new sorted array.

## Example

```js
sort([1, 3, 2]) //=> [1, 2, 3]
sort(['x', 'z', 'y'], 'desc') //=> ['z', 'y', 'x']
```
