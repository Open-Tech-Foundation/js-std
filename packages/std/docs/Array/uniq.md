# uniq

Creates a duplicate-free version of an array.

## Syntax

```ts
import { uniq } from '@opentf/std';

uniq<T>(arr: T[] = [], by?: (val: T) => unknown): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| by | `Function` | The iteratee invoked per element. |

## Returns

`T[]`: A new duplicate-free array.

## Example

```js
uniq([1, 2, 2, 3]) //=> [1, 2, 3]
```
