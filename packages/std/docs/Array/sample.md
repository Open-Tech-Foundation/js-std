# sample

Returns a random element from the given array.

## Syntax

```ts
import { sample } from '@opentf/std';

sample<T>(arr: T[] = []): T | undefined
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |

## Returns

`T | undefined`: A random element, or undefined if empty.

## Example

```js
sample([1, 2, 3]) //=> 1, 2, or 3 (random)
```
