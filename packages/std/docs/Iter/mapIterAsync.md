# mapIterAsync

Transforms each item using an async/sync mapper function.

## Usage

```js
import { mapIterAsync } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await mapIterAsync(asyncGen([1, 2]), x => x * 2);
// ...
```
