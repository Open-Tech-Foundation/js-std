# takeWhile

Creates a slice of array with elements taken from the beginning while the predicate returns true.

## Syntax

```ts
import { takeWhile } from '@opentf/std';

takeWhile<T>(arr: T[] = [], predicate: (val: T, index: number, arr: T[]) => boolean): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| predicate | `Function` | The function invoked per element. |

## Returns

`T[]`: A new array with taken elements.

## Example

```js
takeWhile([1, 2, 3, 4, 5], (n) => n < 4) //=> [1, 2, 3]
takeWhile([1, 2, 3], (n) => n > 3) //=> []
```
