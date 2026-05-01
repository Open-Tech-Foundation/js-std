# unzip

Creates an array of ungrouped elements from a zipped array.

## Syntax

```ts
import { unzip } from '@opentf/std';

unzip<T>(zipped: T[][] = []): T[][]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| zipped | `T[][]` | The zipped array to unzip. |

## Returns

`T[][]`: A new array of arrays.

## Example

```js
unzip([[1, 'a'], [2, 'b']]) //=> [[1, 2], ['a', 'b']]
```
