# bounds

> 📏 Finds both the minimum and maximum values in an array. Supports numbers and strings.

## Syntax

```ts
import { bounds } from '@opentf/std';

bounds<T>(
  arr: T[] = []
): [T, T] | []
```

## Parameters

- `arr`: The array to find bounds in.

## Returns

An array `[min, max]`, or `[]` if the array is empty.

## Examples

```ts
bounds([5, 2, 8, 1]) //=> [1, 8]

bounds(['a', 'z', 'm']) //=> ['a', 'z']
```
