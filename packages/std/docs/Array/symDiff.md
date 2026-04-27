# symDiff

Returns a new array containing elements which are in either this or other, but not in both.

## Syntax

```ts
import { symDiff } from '@opentf/std';

symDiff( collections: unknown[][] = [], by?: (val: unknown) => unknown, ): unknown[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| collections | `unknown[][]` | The arrays to compare. |
| by | `Function` | The iteratee invoked per element. |

## Returns

`unknown[]`: A new array of symmetrical difference values.

## Example

```js
const evens = [2, 4, 6, 8];
const squares = [1, 4, 9];
symDiff([evens, squares]); //=> [2, 6, 8, 1, 9]
```
