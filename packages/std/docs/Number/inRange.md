# inRange

Checks if a number is within the specified range (inclusive).

## Syntax

```ts
import { inRange } from '@opentf/std';

inRange(n: number, start: number, end: number): boolean
```

## Parameters

| Name  | Type     | Description              |
| ----- | -------- | ------------------------ |
| n     | `number` | The number to check.     |
| start | `number` | The start of the range.  |
| end   | `number` | The end of the range.    |

## Returns

`boolean`: True if n is between start and end.

## Example

```js
inRange(3, 0, 5) //=> true
inRange(-1, 0, 5) //=> false
```
