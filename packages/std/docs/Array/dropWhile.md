# dropWhile

Creates a slice of array with elements dropped from the beginning while the predicate returns true.

## Syntax

```ts
import { dropWhile } from '@opentf/std';

dropWhile<T>(arr: T[] = [], predicate: (val: T, index: number, arr: T[]) => boolean): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| predicate | `Function` | The function invoked per element. |

## Returns

`T[]`: A new array with dropped elements removed.

## Example

```js
dropWhile([1, 2, 3, 4, 5], (n) => n < 3) //=> [3, 4, 5]
dropWhile([1, 2, 3], (n) => n > 3) //=> [1, 2, 3]
```
