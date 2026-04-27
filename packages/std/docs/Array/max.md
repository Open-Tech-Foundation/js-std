# max

Returns the maximum value of the given array.

## Syntax

```ts
import { max } from '@opentf/std';

max<T>( arr: T[] = [], by: (val: T) => number | string = (x: T) => x as unknown as number | string, ): T | null
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| by | `Function` | The iteratee to pick the value. |

## Returns

`T|null`: The maximum value.

## Example

```js
max([10, 20, 50, 30]) //=> 50
```
