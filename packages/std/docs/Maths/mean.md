# mean

> 📊 Calculates the average (arithmetic mean) of a list of numbers.

## Syntax

```ts
import { mean } from '@opentf/std';

mean<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number
): number
```

## Parameters

- `arr`: An array of numbers or objects.
- `cb`: An optional iteratee invoked for each element to generate the value to be averaged.

## Returns

The calculated mean. Returns `NaN` for empty arrays.

## Examples

```ts
mean([4, 2, 8]) //=> 4.666666666666667

const objects = [{ a: 4 }, { a: 2 }, { a: 8 }];
mean(objects, (o) => o.a) //=> 4.666666666666667
```
