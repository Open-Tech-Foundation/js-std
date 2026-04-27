# move

Moves an array element from one index position to another.

## Syntax

```ts
import { move } from '@opentf/std';

move<T>(arr: T[], from: number, to: number): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| from | `number` | The index of the element to move. |
| to | `number` | The index to move the element to. |

## Returns

`T[]`: A new array with the moved element.

## Example

```js
move([1, 2, 3], 0, 2) //=> [2, 3, 1]
```
