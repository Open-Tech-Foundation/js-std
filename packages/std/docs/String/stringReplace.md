# stringReplace

Returns a new string with one, some, or all matches of a pattern replaced by a replacement.

String patterns are treated literally. Regular expression patterns preserve
their existing flags, and the `all` / `case` options add `g` / `i` behavior on
top.

### Example

```js

stringReplace('abc', 'a', 'x') //=> 'xbc'

stringReplace('abc abc', 'a', 'x', { all: true }) //=> 'xbc xbc'
```
