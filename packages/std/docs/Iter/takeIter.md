# takeIter

Returns a Generator that yields the first n items from an Iterable.

## Syntax

```ts
import { takeIter } from '@opentf/std';

takeIter
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iterable | `Iterable` | The source iterable. |
| n | `number` | The number of items to take. |

## Returns

`Generator`: A new generator with the first n items.

## Example

```js
const it = takeIter([1, 2, 3], 2);
[...it] //=> [1, 2]
```
