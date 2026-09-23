# stringifyQueryString

Serializes an object to a URL query string in `qs` bracket notation.

This is the inverse of `parseQueryString`: nested objects become `user[name]`
segments, arrays become repeated `tags[]` pairs, and a round trip preserves
the shape for string leaves — numbers and booleans come back as strings,
because a query string is text. Keys and leaves are
percent-encoded with `encodeURIComponent`, so spaces become `%20` and a
literal `+` survives as `%2B` rather than reading back as a space.

Leaves that are not strings are coerced the unsurprising way: numbers and
booleans stringify, a `Date` becomes its ISO string, `null` keeps its key
with an empty value, and `undefined` — like an empty object or array — is
skipped outright. Anything else that is not a plain value (functions,
symbols) is skipped the same way rather than throwing on data.

## Parameters

- **obj** `object` — The object to serialize. Must be a non-array object.

## Returns

`string` — The query string, without a leading `?`.

## Throws

- `TypeError` — If `obj` is not a non-array object, or if it is circular.

## Example

```js
stringifyQueryString({ name: 'Ada', tags: ['a', 'b'], user: { name: 'x' } })
//=> 'name=Ada&tags[]=a&tags[]=b&user[name]=x'
```
