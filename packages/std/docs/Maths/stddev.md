# stddev

Calculates the population standard deviation of the given array.

## Syntax

```ts
import { stddev } from '@opentf/std';

stddev<T>(arr: T[], cb?: (val: T, index: number) => number): number
```

## Returns

`number`: The population standard deviation.

## Example

```js
stddev([2, 4, 4, 4, 5, 5, 7, 9]) //=> 2
```
