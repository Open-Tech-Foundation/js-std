# stringReverse

Reverses a string using grapheme cluster awareness via Intl.Segmenter.
Correctly handles surrogate pairs, combining marks, and emoji sequences.

## Parameters

- **str** `string` — The string to reverse.

## Returns

`string` — The reversed string.

## Example

```js
stringReverse('hello') //=> 'olleh'
stringReverse('café') //=> 'éfac'
stringReverse('👨‍👩‍👧‍👦') //=> '👨‍👩‍👧‍👦'
```
