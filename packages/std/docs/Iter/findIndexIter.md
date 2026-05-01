# findIndexIter

Finds the index of the first item in an iterator that matches a predicate.

## Syntax

```ts
import { findIndexIter } from '@opentf/std';

findIndexIter<T>(iter: Iterable<T>, fn: (val: T) => boolean): number
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to search. |
| fn | `(val: T) => boolean` | The predicate function. |

## Returns

`number`: The index of the first matching item, or -1.

## Example

```js
findIndexIter([1, 2, 3], x => x === 2) //=> 1
```
