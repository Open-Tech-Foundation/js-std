# chunk

Splits an array into groups of a specified size.

## Syntax

```ts
import { chunk } from '@opentf/std';

chunk<T>(arr: T[] = [], size = 1): T[][]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| size | `number` | The length of each chunk. |

## Returns

`T[][]`: A new array containing the chunks.

## Example

```js
chunk(['a', 'b', 'c', 'd'], 2) //=> [['a', 'b'], ['c', 'd']]
chunk(['a', 'b', 'c', 'd'], 3) //=> [['a', 'b', 'c'], ['d']]
```
