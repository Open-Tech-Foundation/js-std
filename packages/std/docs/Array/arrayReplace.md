# arrayReplace

Replaces items at the given index from the given array.

## Syntax

```ts
import { arrayReplace } from '@opentf/std';

arrayReplace<T>( arr: T[] = [], index: number | null = null, deleteCount: number | null = null, ...replacements: T[] ): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| index | `number` | The index to replace items at. |
| deleteCount | `number` | The number of items to delete. |
| replacements | `T[]` | The items to replace with. |

## Returns

`T[]`: A new array with the replaced items.

## Example

```js
arrayReplace([1, 2, 3], 1, 1, 5); //=> [1, 5, 3]
```
