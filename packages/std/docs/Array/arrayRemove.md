# arrayRemove

Removes items at the given index from the given array.

## Syntax

```ts
import { arrayRemove } from '@opentf/std';

arrayRemove<T>( arr: T[] = [], index?: number, count = 1, ): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| index | `number` | The index to remove items from. |
| count | `number` | The number of items to remove. |

## Returns

`T[]`: A new array with the removed items.

## Example

```js
arrayRemove([1, 2, 3], 1, 2); //=> [1]
```
