# parseQueryString

Parses a URL query string into an object, following `qs` bracket notation.

A leading `?` is accepted and a trailing `#fragment` is ignored, so the
value can be lifted straight from a location or a request target. Pairs
split on `&` and on the first `=`; a key with no `=` means an empty value,
and `+` reads as a space before percent-decoding. A segment that fails to
percent-decode is kept raw rather than throwing — bad data must not fail
the parse of good data.

Nesting follows brackets only; dots stay literal, matching `qs` rather
than `toPath`. `user[name]=Ada` nests, `tags[]=a&tags[]=b` appends, and a
key repeated without brackets collects into an array, so `a=1&a=2` reads
as `{ a: ['1', '2'] }` instead of losing the first value the way
`Object.fromEntries(new URLSearchParams(query))` does.

Untrusted input stays cheap and safe: nesting deeper than `MAX_QUERY_DEPTH`
folds into a literal key, a numeric segment past `MAX_ARRAY_INDEX` becomes
a plain object key instead of a hundred-million-long array, and a key
touching `__proto__`, `constructor` or `prototype` is dropped whole — the
same refusal `set` and `unflattenObject` apply.

## Parameters

- **query** `string` — The query string to parse, with or without a leading `?`.

## Returns

`Record<string, unknown>` — The parsed pairs, nested by brackets.

## Throws

- `TypeError` — If `query` is not a string.

## Examples

```js
parseQueryString('?name=Ada&tags[]=a&tags[]=b&user[name]=x')
//=> { name: 'Ada', tags: ['a', 'b'], user: { name: 'x' } }
```

```js
parseQueryString('a=1&a=2') //=> { a: ['1', '2'] }
```
