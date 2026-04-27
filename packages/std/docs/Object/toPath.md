# toPath

Converts the given value into an object property path array.

## Syntax

```ts
import { toPath } from '@opentf/std';

toPath(val: string | unknown | unknown[]): unknown[]
```

## Example

```js
toPath('a.b.c') //=> ['a', 'b', 'c']
```
