# everyIter

Checks if all items in an iterator match a predicate.

## Syntax

```ts
import { everyIter } from '@opentf/std';

everyIter<T>(iter: Iterable<T>, fn: (val: T) => boolean): boolean
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iter | `Iterable<T>` | The iterable to check. |
| fn | `(val: T) => boolean` | The predicate function. |

## Returns

`boolean`: True if all items match, else false.

## Example

```js
everyIter([1, 2, 3], x => x > 0) //=> true
```
