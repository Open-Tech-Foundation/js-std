# dropWhileIter

Returns an iterator that skips items from an iterable as long as a predicate is true, then yields the rest.

## Syntax

```ts
import { dropWhileIter } from '@opentf/std';

dropWhileIter<T>(iter: Iterable<T>, fn: (val: T) => boolean): IterableIterator<T>
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to drop from. |
| fn | `(val: T) => boolean` | The predicate function. |

## Returns

`IterableIterator<T>`: A new iterable iterator.

## Example

```js
const it = dropWhileIter([1, 2, 3, 4], x => x < 3);
[...it] //=> [3, 4]
```
