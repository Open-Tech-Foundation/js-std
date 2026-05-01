# randomFloat

Generates a cryptographically strong random float within a range.

## Syntax

```ts
import { randomFloat } from '@opentf/std';

randomFloat(min: number, max: number): number
```

## Parameters

| Name | Type     | Description                           |
| ---- | -------- | ------------------------------------- |
| min  | `number` | The minimum value (inclusive).        |
| max  | `number` | The maximum value (exclusive).        |

## Returns

`number`: A random float between min (inclusive) and max (exclusive).

## Example

```js
randomFloat(0, 1) //=> 0.7234891234567891
randomFloat(1, 5) //=> 3.456789123456789
```
