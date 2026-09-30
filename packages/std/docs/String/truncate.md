# truncate

Truncates string if it's longer than the given maximum string length.

## Parameters

- **str** `string` — The string to truncate.
- **length** `number` _(default: `30`)_ — The maximum string length.
- **options** `TruncateOptions` _(optional)_ — The marker used to indicate truncation.

## Returns

`string` — The truncated string.

## Example

```js
truncate('hi-package', 8) //=> 'hi-pa...'
truncate('hi-package', 5, { omission: '---' }) //=> 'hi---'

truncate('hi-package', 2) //=> '..'
```
