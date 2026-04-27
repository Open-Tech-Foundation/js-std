# stripANSI

Removes ANSI escape codes from a string.

## Syntax

```ts
import { stripANSI } from '@opentf/std';

stripANSI(str: string): string
```

## Example

```js
stripANSI('\u001b[31mHello\u001b[0m')
//=> 'Hello'
```
