# prod

Calculates the product of values in the given array.

## Syntax

```ts
import { prod } from '@opentf/std';

prod<T>( arr: T[] = [], cb?: (val: T, index: number) => number, ): number
```

## Example

```js
prod([1, 2, 3, 4, 5]) //=> 120
```
