# mapIter

Transforms each item in an iterator using a mapper function.

## Syntax

```ts
import { mapIter } from '@opentf/std';

mapIter<T, U>(iter: Iterable<T>, fn: (val: T) => U): IterableIterator<U>
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to transform. |
| fn | `(val: T) => U` | The mapper function. |

## Returns

`IterableIterator<U>`: A new iterable iterator.

## Example

```js
const doubled = mapIter([1, 2, 3], x => x * 2);
[...doubled] //=> [2, 4, 6]
```
