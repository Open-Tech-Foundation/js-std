# isEmpty

Checks if the given collection is empty.

## Syntax

```ts
import { isEmpty } from '@opentf/std';

isEmpty(val: unknown, sparse = false): boolean
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| val | `unknown` | The value to check. |

## Returns

`boolean`: True if empty, false otherwise.

## Example

```js
isEmpty([]) //=> true
isEmpty({a: 1}) //=> false
```
