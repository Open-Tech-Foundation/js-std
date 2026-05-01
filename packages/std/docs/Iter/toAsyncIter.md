# toAsyncIter

Converts a sync iterable to an async iterable.

## Usage

```js
import { toAsyncIter } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await toAsyncIter([1, 2, 3]);
// ...
```
