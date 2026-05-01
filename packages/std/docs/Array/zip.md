# zip

Creates an array of grouped elements, the first of which contains the first elements of the given arrays, and so on.

## Syntax

```ts
import { zip } from '@opentf/std';

zip<T>(...arrays: T[][]): T[][]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arrays | `T[][]` | The arrays to zip. |

## Returns

`T[][]`: A new zipped array.

## Example

```js
zip([1, 2], ['a', 'b']) //=> [[1, 'a'], [2, 'b']]
zip([1, 2, 3], ['a', 'b']) //=> [[1, 'a'], [2, 'b'], [3, undefined]]
```
