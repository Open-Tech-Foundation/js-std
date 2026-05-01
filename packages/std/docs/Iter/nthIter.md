# nthIter

Returns the nth item (0-indexed) from an iterable.

## Syntax

```ts
import { nthIter } from '@opentf/std';

nthIter<T>(iter: Iterable<T>, n: number): T | undefined
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to search. |
| n | `number` | The index of the item to return. |

## Returns

`T | undefined`: The nth item, or undefined.

## Example

```js
nthIter([1, 2, 3], 1) //=> 2
```
