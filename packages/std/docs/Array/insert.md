# insert

Inserts items at the given index into the given array.

## Syntax

```ts
import { insert } from '@opentf/std';

insert<T>(arr: T[] = [], index: number | null | undefined, ...items: T[]): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| index | `number` | The index to insert items at. |
| items | `T[]` | The items to insert. |

## Returns

`T[]`: A new array with the inserted items.

## Example

```js
insert([1, 2, 3], 1, 5); //=> [1, 5, 2, 3]
```
