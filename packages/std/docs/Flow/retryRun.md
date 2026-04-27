# retryRun

Retries an asynchronous function according to the specified options.

## Syntax

```ts
import { retryRun } from '@opentf/std';

retryRun
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| func | `Function` | The async function to retry. |

## Returns

`Promise<T>`: A promise that resolves to the function result.

## Example

```js
const result = await retryRun(() => fetchData(), { retries: 3, delay: 1000 });
```
