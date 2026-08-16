# truncate

Truncates string if it's longer than the given maximum string length.

## Parameters

- **str** `string` — The string to truncate.
- **length** `number` _(default: `30`)_ — The maximum string length.
- **omission** `string` _(default: `'...'`)_ — The string to indicate truncation. It is itself truncated when it does not fit within the given length.

## Returns

`string` — The truncated string.

## Example

```js
truncate('hi-package', 8) //=> 'hi-pa...'

truncate('hi-package', 2) //=> '..'
```
