# stringReplaceAt

Replaces characters in a string at a specific index.

It overwrites as many characters as `replaceStr` is long, so the result keeps the length of the source string. An empty `replaceStr` removes one character.

`index` must be a non-negative integer.

@param {string} str The source string.
@param {number} [index=0] The index to start replacement.
@param {string} [replaceStr=''] The replacement string.
@returns {string} The modified string.

### Example

```js
stringReplaceAt('abc', 1, 'z') //=> 'azc'

stringReplaceAt('I HATE U', 2, 'LUV') //=> 'I LUVE U'
```
