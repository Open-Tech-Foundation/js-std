# stringWidth

Calculates the visual width of a string in a terminal.
Handles ANSI escape codes (0 width) and full-width characters (2 width).
Uses the native Intl.Segmenter for high-precision grapheme identification.

### Example

```js

stringWidth('abc') //=> 3
stringWidth('\x1b[31mabc\x1b[0m') //=> 3
stringWidth('🔥') //=> 2
stringWidth('こんにちは') //=> 10
```
