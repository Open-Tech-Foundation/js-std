# strReplace

Returns a new string with one, some, or all matches of a pattern replaced by a replacement.

## Syntax

```ts
import { strReplace } from '@opentf/std';

strReplace( str: string, pattern: string | RegExp, replacement: string, options?: StrReplaceOptions, ): string
```

## Example

```js
strReplace('abc', 'a', 'x') //=> 'xbc'

strReplace('abc abc', 'a', 'x', { all: true }) //=> 'xbc xbc'
```
