# isTypedArray

Checks if the given value is a TypedArray.

## Syntax

```ts
import { isTypedArray } from '@opentf/std';

isTypedArray(val: unknown): val is TypedArray
```

## Example

```js
isTypedArray([]) //=> false

isTypedArray(new Int8Array()) //=> true

isTypedArray(new Float64Array()) //=> true
```
