# countIterAsync

Returns the total count of items in an async iterable.

## Usage

```js
import { countIterAsync } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await countIterAsync(asyncGen([1, 2, 3]));
// ...
```
