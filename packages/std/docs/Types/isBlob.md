# isBlob

Checks if the given value is a blob.

## Syntax

```ts
import { isBlob } from '@opentf/std';

isBlob(val: unknown): val is Blob
```

## Example

```js
isBlob(new Blob()) //=> true

isBlob({}) //=> false
```
