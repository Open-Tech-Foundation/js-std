# drop

Skips the given number of elements at the start of the given array.

## Syntax

```ts
import { drop } from '@opentf/std';

drop<T>( arr: T[], limit: number | null = 1, cb?: (val: T) => boolean, ): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| limit | `number` | The number of elements to drop. |
| cb | `Function` | The callback to test elements. |

## Returns

`T[]`: A new array with dropped elements.

## Example

```js
drop([1, 2, 3, 4, 5], 3) //=> [4, 5]
```
