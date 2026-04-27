# reverse

Reverses the order of elements in the given array.

## Syntax

```ts
import { reverse } from '@opentf/std';

reverse<T>(arr: T[] = []): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |

## Returns

`T[]`: A new reversed array.

## Example

```js
reverse([1, 2, 3]) //=> [3, 2, 1]
```
