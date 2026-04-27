# isArrayBuffer

Checks if the given value is an ArrayBuffer.

## Syntax

```ts
import { isArrayBuffer } from '@opentf/std';

isArrayBuffer(val: unknown): val is ArrayBuffer
```

## Example

```js
isArrayBuffer([]) //=> false

isArrayBuffer(new ArrayBuffer(8)) //=> true
```
