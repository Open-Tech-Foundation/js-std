# median

> 📊 Calculates the median value of a list of numbers.

## Syntax

```ts
import { median } from '@opentf/std';

median<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number
): number
```

## Parameters

- `arr`: An array of numbers or objects.
- `cb`: An optional iteratee invoked for each element to generate the value to be used for median calculation.

## Returns

The calculated median. Returns `NaN` for empty arrays.

## Examples

```ts
median([4, 2, 8]) //=> 4 (Sorted: [2, 4, 8])

median([10, 20, 40, 50]) //=> 30 (Average of 20 and 40)
```
