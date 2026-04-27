# compact

Removes all the falsy values in the given array.

## Syntax

```ts
import { compact } from '@opentf/std';

compact<T>(arr: T[] = []): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |

## Returns

`T[]`: A new array without falsy values.

## Example

```js
compact([1, null, 2, 0, 3]) //=> [1, 2, 3]
```
