# unescapeHTML

Unescapes HTML entities back to their original characters.

Supports both `&#39;` and `&apos;` for apostrophes.

### Example

```js

unescapeHTML('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
//=> '<script>alert("xss")</script>'
```
