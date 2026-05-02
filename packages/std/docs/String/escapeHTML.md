# escapeHTML

Escapes characters for use in HTML.

### Example

```js

escapeHTML('<script>alert("xss")</script>')
//=> '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```
