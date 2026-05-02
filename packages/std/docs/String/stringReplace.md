# stringReplace

Returns a new string with one, some, or all matches of a pattern replaced by a replacement.

## Syntax

```ts
import { stringReplace } from '@opentf/std';

stringReplace( str: string, pattern: string | RegExp, replacement: string, options?: StringReplaceOptions, ): string
```

## Example

```js
stringReplace('abc', 'a', 'x') //=> 'xbc'

stringReplace('abc abc', 'a', 'x', { all: true }) //=> 'xbc xbc'
```
