# repeat

Repeats the given string n times.

## Syntax

```ts
import { repeat } from '@opentf/std';

repeat(str: string, n = 1): string
```

## Example

```js
repeat('*', 3) //=> '***'

repeat('abc', 2) //=> 'abcabc'

repeat('abc', 0) //=> ''
```
