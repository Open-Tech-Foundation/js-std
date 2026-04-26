# sum

> ➕ Calculates the sum of all numbers in an array.

## Syntax

```ts
import { sum } from '@opentf/std';

sum<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number
): number
```

## Parameters

- `arr`: An array of numbers or objects.
- `cb`: An optional iteratee invoked for each element to generate the value to be summed.

## Returns

The sum of all elements. Returns `0` for empty arrays.

## Examples

```ts
sum([1, 2, 3, 4, 5]) //=> 15

const objects = [{ n: 4 }, { n: 2 }, { n: 8 }];
sum(objects, (v) => v.n) //=> 14
```
