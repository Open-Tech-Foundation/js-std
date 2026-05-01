# lastIterAsync

Returns the last item from an async iterable.

## Usage

```js
import { lastIterAsync } from '@opentf/std';

async function* asyncGen(arr) {
  for (const item of arr) {
    yield item;
  }
}

const result = await lastIterAsync(asyncGen([1, 2, 3]));
// ...
```
