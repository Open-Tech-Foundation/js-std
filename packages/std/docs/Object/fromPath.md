# fromPath

Converts the given array values into an object property path string.

## Syntax

```ts
import { fromPath } from '@opentf/std';

fromPath(arr: (string | number)[] = []): string
```

## Example

```js
fromPath(['a', '0', 'b', 'c']) //=> 'a[0].b.c'
```
