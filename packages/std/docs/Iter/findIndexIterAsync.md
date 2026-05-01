# findIndexIterAsync

Returns the index of the first item that matches the predicate.

## Usage

```js
import { findIndexIterAsync } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await findIndexIterAsync(asyncGen([1, 2, 3]), x => x === 2);
// ...
```
