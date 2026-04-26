# prod

> ✖️ Calculates the product of all numbers in an array.

## Syntax

```ts
import { prod } from '@opentf/std';

prod<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => number
): number
```

## Parameters

- `arr`: An array of numbers or objects.
- `cb`: An optional iteratee invoked for each element to generate the value to be multiplied.

## Returns

The product of all elements. Returns `1` for empty arrays.

## Examples

```ts
prod([1, 2, 3, 4, 5]) //=> 120

const objects = [{ n: 4 }, { n: 2 }, { n: 8 }];
prod(objects, (v) => v.n) //=> 64
```
