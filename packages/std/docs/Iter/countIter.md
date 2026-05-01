# countIter

Returns the total count of items in an iterable.

## Syntax

```ts
import { countIter } from '@opentf/std';

countIter(iter: Iterable<unknown>): number
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<unknown>` | The iterable to count. |

## Returns

`number`: The total count of items.

## Example

```js
countIter((function*() { yield 1; yield 2; })()) //=> 2
```
