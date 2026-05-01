# findLastIndexIterAsync

Returns the index of the last item that matches the predicate.

## Usage

```js
import { findLastIndexIterAsync } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await findLastIndexIterAsync(asyncGen([1, 2, 3, 2]), x => x === 2);
// ...
```
