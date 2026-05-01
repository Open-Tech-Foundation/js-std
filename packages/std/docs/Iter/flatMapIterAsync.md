# flatMapIterAsync

Maps each item and flattens the resulting async/sync iterators.

## Usage

```js
import { flatMapIterAsync } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await flatMapIterAsync(asyncGen([1, 2]), x => [x, x * 10]);
// ...
```
