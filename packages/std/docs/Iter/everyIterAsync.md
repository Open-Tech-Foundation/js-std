# everyIterAsync

Returns true if all items match the predicate.

## Usage

```js
import { everyIterAsync } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await everyIterAsync(asyncGen([1, 2, 3]), x => x > 0);
// ...
```
