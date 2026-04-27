# countBy

Creates an object composed of keys generated from the results of running each element of collection through iteratee.

## Syntax

```ts
import { countBy } from '@opentf/std';

countBy<T>( arr: T[], by: ((val: T) => string) | string, ): Record<string, number>
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| arr | `T[]` | The source array. |
| by | `Function|string` | The iteratee to transform keys. |

## Returns

`Record<string, number>`: The composed aggregate object.

## Example

```js
countBy([6.1, 4.2, 6.3], Math.floor) //=> { '4': 1, '6': 2 }
```
