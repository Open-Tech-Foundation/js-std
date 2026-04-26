# max

> 📈 Finds the maximum value in an array. Supports numbers and strings.

## Syntax

```ts
import { max } from '@opentf/std';

max<T>(
  arr: T[] = []
): T | undefined
```

## Parameters

- `arr`: The array to find the maximum value in.

## Returns

The maximum value in the array, or `undefined` if the array is empty.

## Examples

```ts
max([5, 2, 8, 1]) //=> 8

max(['apple', 'banana', 'cherry']) //=> 'cherry'
```
