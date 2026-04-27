# groupBy

Creates an object composed of keys generated from the results of running each element of collection through iteratee.

## Syntax

```ts
import { groupBy } from '@opentf/std';

groupBy<T>( arr: T[], key: ((val: T) => string) | keyof T, ): Record<string, T[]>
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| key | `Function|string` | The iteratee to transform keys. |

## Returns

`Record<string, T[]>`: The composed aggregate object.

## Example

```js
groupBy([6.1, 4.2, 6.3], Math.floor) //=> { '4': [4.2], '6': [6.1, 6.3] }
```
