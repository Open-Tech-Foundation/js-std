# wordWrap

Wraps text to a column width, breaking at whitespace.

Width is measured with [stringWidth](./stringWidth.md), so ANSI escapes cost nothing, CJK and emoji count as two columns, and a grapheme is never split down the middle. That is what makes the result line up in a terminal, which counting `String.length` does not.

Each input line is wrapped on its own, so blank lines and paragraph breaks survive. Leading whitespace on a line is kept, so an indented block stays indented; continuation lines are not indented to match. The whitespace run at a break is consumed by the newline, and no output line has trailing whitespace. Line endings are normalised to `\n`.

A word wider than `width` overruns by default. Pass `hard` to break it instead — the word is still given a line of its own first, and is only split if it does not fit there either.

@param {string} str The text to wrap.
@param {number} [width=80] The maximum column width. Must be a positive integer.
@param {object} [options] Wrapping options.
@param {boolean} [options.hard=false] Break words wider than `width`.
@returns {string} The wrapped text.

### Example

```js
wordWrap('the quick brown fox', 10)
//=> 'the quick\nbrown fox'

wordWrap('a supercalifragilistic b', 5)
//=> 'a\nsupercalifragilistic\nb'

wordWrap('a supercalifragilistic b', 5, { hard: true })
//=> 'a\nsuper\ncalif\nragil\nistic\nb'
```
