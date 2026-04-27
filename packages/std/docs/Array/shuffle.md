# shuffle

Randomizes the order of the elements in a given array.

## Syntax

```ts
import { shuffle } from '@opentf/std';

shuffle<T>(arr: T[]): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |

## Returns

`T[]`: A new shuffled array.

## Example

```js
shuffle([1, 2, 3]) //=> [2, 3, 1]
```
