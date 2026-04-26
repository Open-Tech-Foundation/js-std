# mode

> 📊 Calculates the mode value(s) of a list.

## Syntax

```ts
import { mode } from '@opentf/std';

mode<T>(
  arr: T[] = [],
  cb?: (val: T, index: number) => string | number
): (string | number)[]
```

## Parameters

- `arr`: The source array.
- `cb`: An optional iteratee invoked for each element to generate the value to be used for mode calculation.

## Returns

An array containing the most frequent element(s). Returns `[]` if all elements are unique or if the input array is empty.

## Examples

```ts
mode([4, 2, 3, 2, 2]) //=> [2]

mode([0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 4]) //=> [1, 2]

mode(['a', 'b', 'b', 'c', 'c']) //=> ['b', 'c']
```
