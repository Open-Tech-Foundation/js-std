# takeIterAsync

Returns an AsyncGenerator that yields the first n items from an AsyncIterable.

## Syntax

```ts
import { takeIterAsync } from '@opentf/std';

takeIterAsync
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| iterable | `AsyncIterable` | The source async iterable. |
| n | `number` | The number of items to take. |

## Returns

`AsyncGenerator`: A new async generator with the first n items.

## Example

```js
const it = takeIterAsync(asyncIterable, 2);
for await (const item of it) { ... }
```
