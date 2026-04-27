# isEql

Checks deeply if the given two values are equivalent.

## Syntax

```ts
import { isEql } from '@opentf/std';

isEql( val1: unknown, val2: unknown, options?:
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| val1 | `unknown` | The first value to compare. |
| val2 | `unknown` | The second value to compare. |

## Returns

`boolean`: True if values are equivalent, false otherwise.

## Example

```js
isEql({a: [{b: 1}]}, {a: [{b: 1}]}) //=> true
isEql(null, undefined) //=> false
```
