# firstIter

Returns the first item from an iterable.

## Syntax

```ts
import { firstIter } from '@opentf/std';

firstIter<T>(iter: Iterable<T>): T | undefined
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to get the first item from. |

## Returns

`T | undefined`: The first item, or undefined.

## Example

```js
firstIter([1, 2, 3]) //=> 1
```
