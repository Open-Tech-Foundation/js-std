# findIter

Finds the first item in an iterator that matches a predicate.

## Syntax

```ts
import { findIter } from '@opentf/std';

findIter<T>(iter: Iterable<T>, fn: (val: T) => boolean): T | undefined
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to search. |
| fn | `(val: T) => boolean` | The predicate function. |

## Returns

`T | undefined`: The first matching item, or undefined.

## Example

```js
findIter([1, 2, 3], x => x > 1) //=> 2
```
