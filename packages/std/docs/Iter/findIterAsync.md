# findIterAsync

Returns the first item that matches the predicate.

## Usage

```js
import { findIterAsync } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await findIterAsync(asyncGen([1, 2, 3]), x => x > 1);
// ...
```
