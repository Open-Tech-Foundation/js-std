# min

Returns the minimum value of the given array.

## Syntax

```ts
import { min } from '@opentf/std';

min<T>( arr: T[] = [], by: (val: T) => number | string = (x: T) => x as unknown as number | string, ): T | null
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| by | `Function` | The iteratee to pick the value. |

## Returns

`T|null`: The minimum value.

## Example

```js
min([10, 20, 50, 30]) //=> 10
```
