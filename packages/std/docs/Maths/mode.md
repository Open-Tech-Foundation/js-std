# mode

Calculates the mode of the given array.

## Syntax

```ts
import { mode } from '@opentf/std';

mode<T>( arr: T[] = [], cb?: (val: T, index: number) => string | number, ): (string | number)[]
```

## Example

```js
mode([1, 2, 2, 3, 4]) //=> [2]
mode([1, 2, 2, 3, 3, 4]) //=> [2, 3]
```
