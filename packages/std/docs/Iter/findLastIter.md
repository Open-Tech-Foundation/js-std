# findLastIter

Finds the last item in an iterator that matches a predicate.

## Syntax

```ts
import { findLastIter } from '@opentf/std';

findLastIter<T>(iter: Iterable<T>, fn: (val: T) => boolean): T | undefined
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to search. |
| fn | `(val: T) => boolean` | The predicate function. |

## Returns

`T | undefined`: The last matching item, or undefined.

## Example

```js
findLastIter([1, 2, 3, 2], x => x === 2) //=> 2 (the second one)
```
