# sortBy

Sorts an array of objects by one or more criteria.

## Syntax

```ts
import { sortBy } from '@opentf/std';

sortBy<T>(arr: T[], ...tuples: OrderTuples<T>): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| tuples | `OrderTuples` | The criteria to sort by. |

## Returns

`T[]`: A new sorted array.

## Example

```js
const arr = [{a: 1}, {a: 3}, {a: 2}]
sortBy(arr, ['a', 'asc']); //=> [{a: 1}, {a: 2}, {a: 3}]
```
