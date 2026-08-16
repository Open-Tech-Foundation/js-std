# toPath

Converts the given value into an object property path array.

A number or a symbol is a single-segment path, and anything else has no
segments at all, so it yields an empty array.

## Parameters

- **val** `PropertyPath|number|symbol` — The value to convert.

## Returns

`unknown[]` — The path segments.

## Example

```js
toPath('a.b.c') //=> ['a', 'b', 'c']
```
