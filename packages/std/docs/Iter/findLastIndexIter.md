# findLastIndexIter

Finds the index of the last item in an iterator that matches a predicate.

## Syntax

```ts
import { findLastIndexIter } from '@opentf/std';

findLastIndexIter<T>(iter: Iterable<T>, fn: (val: T) => boolean): number
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to search. |
| fn | `(val: T) => boolean` | The predicate function. |

## Returns

`number`: The index of the last matching item, or -1.

## Example

```js
findLastIndexIter([1, 2, 3, 2], x => x === 2) //=> 3
```
