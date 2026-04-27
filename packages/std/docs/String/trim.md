# trim

Removes leading and trailing whitespace or specified characters from string.

## Syntax

```ts
import { trim } from '@opentf/std';

trim(str: string, chars?: string): string
```

## Example

```js
trim('  abc  ') //=> 'abc'

trim('-_-abc-_-', '_-') //=> 'abc'
```
