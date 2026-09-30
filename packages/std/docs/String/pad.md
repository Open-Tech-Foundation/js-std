# pad

Pads string on the left and right sides if it's shorter than length.
Padding characters are truncated if they can't be evenly divided by length.

## Parameters

- **str** `string` — The string to pad.
- **length** `number` _(default: `0`)_ — The target length.
- **options** `PadOptions` _(optional)_ — The characters to use for padding.

## Example

```js
pad('abc', 8) //=> '  abc   '

pad('abc', 8, { chars: '_-' }) //=> '_-abc_-_'

pad('abc', 3) //=> 'abc'

pad('abc', 8, { chars: '' }) //=> 'abc'
```
