# stringSplice

Removes characters from a string and inserts another in their place, following `Array.prototype.splice`.

Indices count UTF-16 code units, as `slice` and `indexOf` do, so a position taken from either can be passed straight in. A boundary landing inside a surrogate pair is widened to cover the whole character, so the result is always well-formed.

`start` must be a finite integer; a negative one counts back from the end. Omit `deleteCount` to remove everything from `start` onwards.

@param {string} str The source string.
@param {number} [start=0] The index to start changing the string at.
@param {number} [deleteCount] The number of characters to remove.
@param {string} [insert=''] The string to insert at `start`.
@returns {string} The modified string.

### Example

```js
stringSplice('abcdef', 2, 2, 'XY') //=> 'abXYef'

stringSplice('ac', 1, 0, 'b') //=> 'abc'

stringSplice('abc', 1, 1) //=> 'ac'

stringSplice('abcdef', 2) //=> 'ab'

stringSplice('abcdef', -2, 2, 'XY') //=> 'abcdXY'
```
