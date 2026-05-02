# stringReplace

Returns a new string with one, some, or all matches of a pattern replaced by a replacement.

### Example

```js

stringReplace('abc', 'a', 'x') //=> 'xbc'

stringReplace('abc abc', 'a', 'x', { all: true }) //=> 'xbc xbc'
```
