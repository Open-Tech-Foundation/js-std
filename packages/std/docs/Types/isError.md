# isError

Checks if the given value is an error.

## Syntax

```ts
import { isError } from '@opentf/std';

isError(val: unknown): val is Error
```

## Example

```js
isError(new Error()) //=> true

isError({msg: '', name: ''}) //=> false
```
