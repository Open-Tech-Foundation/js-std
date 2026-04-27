# escapeHTML

Escapes characters for use in HTML.

## Syntax

```ts
import { escapeHTML } from '@opentf/std';

escapeHTML(str: string): string
```

## Example

```js
escapeHTML('<script>alert("xss")</script>')
//=> '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```
