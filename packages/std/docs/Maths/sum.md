# sum

Calculates the sum of values in the given array.

## Syntax

```ts
import { sum } from '@opentf/std';

sum<T>( arr: T[] = [], cb?: (val: T, index: number) => number, ): number
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| cb | `Function` | The iteratee invoked per element. |

## Returns

`number`: The sum of values.

## Example

```js
sum([1, 2, 3, 4, 5]) //=> 15
```
