# inRange

Checks if a number is within the specified range (inclusive).

## Parameters

- **n** — The number to check.
- **options** — The inclusive start and end of the range.

## Returns

True if n is between start and end.

## Example

```js
inRange(3, { start: 0, end: 5 }) //=> true
inRange(-1, { start: 0, end: 5 }) //=> false
```
