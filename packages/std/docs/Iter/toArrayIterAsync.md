# toArrayIterAsync

Collects all items into an array.

## Usage

```js
import { toArrayIterAsync } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await toArrayIterAsync(asyncGen([1, 2, 3]));
// ...
```
