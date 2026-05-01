# variance

Calculates the population variance of the given array.

## Syntax

```ts
import { variance } from '@opentf/std';

variance<T>(arr: T[], cb?: (val: T, index: number) => number): number
```

## Returns

`number`: The population variance.

## Example

```js
variance([2, 4, 4, 4, 5, 5, 7, 9]) //=> 4
```
