# flatten

Flattens an array up to the specified depth.

## Syntax

```ts
import { flatten } from '@opentf/std';

flatten<T>(arr: T[] = [], depth = 1): any[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| depth | `number` | The maximum recursion depth. Defaults to `1`. |

## Returns

`any[]`: A new flattened array.

## Example

```js
flatten([1, [2, [3, [4]]]]) //=> [1, 2, [3, [4]]]
flatten([1, [2, [3, [4]]]], 2) //=> [1, 2, 3, [4]]
flatten([1, [2, [3, [4]]]], Infinity) //=> [1, 2, 3, 4]
```
