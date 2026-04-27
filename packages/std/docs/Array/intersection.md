# intersection

Creates an array of unique values that are included in all given arrays.

## Syntax

```ts
import { intersection } from '@opentf/std';

intersection<T>( arr: T[][], by?: (val: T) => unknown, ): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[][]` | The arrays to intersect. |
| by | `Function` | The iteratee invoked per element. |

## Returns

`T[]`: A new array of intersecting values.

## Example

```js
intersection([[1, 2, 3], [2, 3, 4]]) //=> [2, 3]
intersection([[2.1, 1.2], [2.3, 3.4]], Math.floor) //=> [2.1]
```
