# unescapeHTML

Unescapes HTML entities back to their original characters.

### Example

```js

unescapeHTML('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
//=> '<script>alert("xss")</script>'
```
