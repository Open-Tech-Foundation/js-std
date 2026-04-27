# dropIterAsync

Returns an AsyncGenerator that skips the first n items from an AsyncIterable.

## Syntax

```ts
import { dropIterAsync } from '@opentf/std';

dropIterAsync
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iterable | `AsyncIterable` | The source async iterable. |
| n | `number` | The number of items to skip. |

## Returns

`AsyncGenerator`: A new async generator with the remaining items.

## Example

```js
const it = dropIterAsync(asyncIterable, 1);
for await (const item of it) { ... }
```
