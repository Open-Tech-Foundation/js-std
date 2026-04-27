# mean

Calculates the mean value of the given array.

## Syntax

```ts
import { mean } from '@opentf/std';

mean<T>( arr: T[] = [], cb?: (val: T, index: number) => number, ): number
```

## Example

```js
mean([4, 2, 8]) //=> 4.666666666666667
```
