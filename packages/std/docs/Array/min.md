# min

> 📉 Finds the minimum value in an array. Supports numbers and strings.

## Syntax

```ts
import { min } from '@opentf/std';

min<T>(
  arr: T[] = []
): T | undefined
```

## Parameters

- `arr`: The array to find the minimum value in.

## Returns

The minimum value in the array, or `undefined` if the array is empty.

## Examples

```ts
min([5, 2, 8, 1]) //=> 1

min(['apple', 'banana', 'cherry']) //=> 'apple'
```
