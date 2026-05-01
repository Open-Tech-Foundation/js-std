# toArrayIter

Collects all items from an iterator into an array.

## Syntax

```ts
import { toArrayIter } from '@opentf/std';

toArrayIter<T>(iter: Iterable<T>): T[]
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to collect. |

## Returns

`T[]`: An array of all items.

## Example

```js
toArrayIter((function*() { yield 1; yield 2; })()) //=> [1, 2]
```
