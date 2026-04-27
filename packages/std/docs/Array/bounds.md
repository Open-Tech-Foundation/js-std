# bounds

Returns the minimum and maximum values of the given array.

## Syntax

```ts
import { bounds } from '@opentf/std';

bounds<T>( arr: T[] = [], by: (val: T) => number | string = (x: T) => x as unknown as number | string, ): [T, T] | null
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| by | `Function` | The iteratee to pick the value. |

## Returns

`[T, T] | null`: An array containing the minimum and maximum values.

## Example

```js
bounds([10, 20, 50, 30]) //=> [10, 50]
```
