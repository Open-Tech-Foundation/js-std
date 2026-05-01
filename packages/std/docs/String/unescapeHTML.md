# unescapeHTML

Unescapes HTML entities back to their original characters.

## Syntax

```ts
import { unescapeHTML } from '@opentf/std';

unescapeHTML(str: string): string
```

## Returns

`string`: The unescaped string.

## Example

```js
unescapeHTML('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
//=> '<script>alert("xss")</script>'
```
