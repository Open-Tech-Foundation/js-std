# take

Creates a slice of array with n elements taken from the beginning.

## Syntax

```ts
import { take } from '@opentf/std';

take<T>( arr: T[], limit: number | null = 1, cb?: (val: T) => boolean, ): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| limit | `number` | The number of elements to take. |
| cb | `Function` | The callback to test elements. |

## Returns

`T[]`: A new array with taken elements.

## Example

```js
take([1, 2, 3, 4, 5], 3) //=> [1, 2, 3]
```
