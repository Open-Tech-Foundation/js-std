# randomString

Generates a cryptographically strong random string.

## Syntax

```ts
import { randomString } from '@opentf/std';

randomString( length: number, chars: string = DEFAULT_CHARS, ): string
```

## Example

```js
randomString(10) //=> 'aB3dE5gH1j'
randomString(5, '01') //=> '10110'
```
