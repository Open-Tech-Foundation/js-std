# reduceIterAsync

Accumulates values from the async iterator.

## Usage

```js
import { reduceIterAsync } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await reduceIterAsync(asyncGen([1, 2, 3]), (acc, x) => acc + x, 0);
// ...
```
