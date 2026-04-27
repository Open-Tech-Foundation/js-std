# isPromise

Checks if the given value is a Promise object.

## Syntax

```ts
import { isPromise } from '@opentf/std';

isPromise(val: unknown): val is Promise<unknown>
```

## Example

```js
isPromise({}) //=> false

isPromise(Promise.resolve()) //=> true
```
