# swap

Swaps two elements in an array at the given indices.

## Syntax

```ts
import { swap } from '@opentf/std';

swap<T>(arr: T[], x: number, y: number): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| x | `number` | The index of the first element. |
| y | `number` | The index of the second element. |

## Returns

`T[]`: A new array with swapped elements.

## Example

```js
swap([1, 2, 3, 4, 5], 0, 1) //=> [2, 1, 3, 4, 5]
```
