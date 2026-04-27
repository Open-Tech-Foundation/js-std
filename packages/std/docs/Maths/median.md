# median

Calculates the median value of the given array.

## Syntax

```ts
import { median } from '@opentf/std';

median<T>( arr: T[] = [], cb?: (val: T, index: number) => number, ): number
```

## Example

```js
median([4, 2, 8]) //=> 4
```
