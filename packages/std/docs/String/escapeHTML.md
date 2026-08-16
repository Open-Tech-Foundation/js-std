# escapeHTML

Escapes characters for use in HTML.

The backtick is escaped along with the quotes. It is not special in HTML
itself, but it ends a template literal, and escaped text is often dropped
into one on the way to the page. Older IE also accepted it as an attribute
delimiter, which is the form the OWASP guidance is written against.

This escapes text for an element body or a quoted attribute. It is not
enough on its own inside a `<script>` or `<style>` block, or in a URL, an
unquoted attribute or an event handler — those need their own encoding.

## Parameters

- **str** `string` — The string to escape.

## Returns

`string` — The escaped string.

## Example

```js
escapeHTML('<script>alert("xss")</script>')
//=> '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```
