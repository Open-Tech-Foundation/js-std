# takeWhileIter

Returns an iterator that yields items from an iterable as long as a predicate is true.

## Syntax

```ts
import { takeWhileIter } from '@opentf/std';

takeWhileIter<T>(iter: Iterable<T>, fn: (val: T) => boolean): IterableIterator<T>
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to take from. |
| fn | `(val: T) => boolean` | The predicate function. |

## Returns

`IterableIterator<T>`: A new iterable iterator.

## Example

```js
const it = takeWhileIter([1, 2, 3, 4], x => x < 3);
[...it] //=> [1, 2]
```
