# filterIter

Filters items in an iterator based on a predicate.

## Syntax

```ts
import { filterIter } from '@opentf/std';

filterIter<T>(iter: Iterable<T>, fn: (val: T) => boolean): IterableIterator<T>
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to filter. |
| fn | `(val: T) => boolean` | The predicate function. |

## Returns

`IterableIterator<T>`: A new iterable iterator.

## Example

```js
const evens = filterIter([1, 2, 3, 4], x => x % 2 === 0);
[...evens] //=> [2, 4]
```
