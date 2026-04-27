# range

Creates an array of numbers progressing from start up to, but not including, end.

## Syntax

```ts
import { range } from '@opentf/std';

range( ...args: [number?, number?, (RangeOptions | number)?] ): number[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| start | `number` | The start of the range. |
| end | `number` | The end of the range. |
| options | `number|Object` | The step or options object. |

## Returns

`number[]`: A new array of numbers.

## Example

```js
range(4) //=> [0, 1, 2, 3]
range(-4) //=> [0, -1, -2, -3]
range(1, 5) //=> [1, 2, 3, 4]
range(0, 20, 5) //=> [0, 5, 10, 15]
range(1, 4, {step: 1, inclusiveEnd: true}) //=> [1, 2, 3, 4]
```
