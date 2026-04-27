# diff

Creates an array with the values of the first array not included in the other arrays.

## Syntax

```ts
import { diff } from '@opentf/std';

diff( collections: unknown[][] = [], by?: (val: unknown) => unknown, ): unknown[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| collections | `unknown[][]` | The arrays to compare. |
| by | `Function` | The iteratee invoked per element. |

## Returns

`unknown[]`: A new array of filtered values.

## Example

```js
diff([[1, 2], [2, 3]]) //=> [1]
diff([[1, "a"], [1, 2]]) //=> ['a']
```
