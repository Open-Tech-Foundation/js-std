# lastIter

Returns the last item from an iterable.

## Syntax

```ts
import { lastIter } from '@opentf/std';

lastIter<T>(iter: Iterable<T>): T | undefined
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to get the last item from. |

## Returns

`T | undefined`: The last item, or undefined.

## Example

```js
lastIter([1, 2, 3]) //=> 3
```
