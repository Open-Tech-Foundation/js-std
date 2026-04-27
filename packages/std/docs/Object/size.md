# size

Returns the size of the given value.

## Syntax

```ts
import { size } from '@opentf/std';

size(val: unknown): number
```

## Example

```js
size([]) //=> 0

size('a') //=> 1

size({a: 1, b: 3}) //=> 2
```
