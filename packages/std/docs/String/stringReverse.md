# stringReverse

Reverses a string using grapheme cluster awareness via Intl.Segmenter.
Correctly handles surrogate pairs, combining marks, and emoji sequences.

@param {string} str The string to reverse.
@returns {string} The reversed string.

### Example

```js
stringReverse('hello') //=> 'olleh'
stringReverse('café') //=> 'éfac'
stringReverse('👨‍👩‍👧‍👦') //=> '👨‍👩‍👧‍👦'
```
