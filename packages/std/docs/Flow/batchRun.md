# batchRun

Creates a batched function that collects calls and processes them in groups.

## Syntax

```ts
import { batchRun } from '@opentf/std';

batchRun<T extends any[], R>( batchProcessor: (argsList: T[]) => Promise<R[]>, options:
```

## Example

```js
const batchFetch = batchRun(async (batch) => {
// batch is an array of arguments: [[1], [2], [3]]
return await fetchUsers(batch.map(args => args[0]));
}, { limit: 10, delay: 50 });

const user1 = batchFetch(1);
const user2 = batchFetch(2);
```
