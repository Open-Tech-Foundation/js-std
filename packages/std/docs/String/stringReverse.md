# stringReverse

Reverses a string using grapheme cluster awareness via Intl.Segmenter.
Correctly handles surrogate pairs, combining marks, and emoji sequences.

## Syntax

```ts
import { stringReverse } from '@opentf/std';

stringReverse(str: string): string
```

## Example

```js
stringReverse('hello') //=> 'olleh'
stringReverse('café') //=> 'éfac'
stringReverse('👨‍👩‍👧‍👦') //=> '👨‍👩‍👧‍👦'
```
