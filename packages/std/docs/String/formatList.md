# formatList

Joins a list of strings into readable prose.

`items.join(', ')` gives `'a, b, c'`, which is not a sentence. This gives
`'a, b, and c'` — with the connector, the punctuation before it and the
separate form a two-item list takes, all of which differ by language and
none of which are worth hand-rolling.

Where the runtime provides `Intl.ListFormat` it is used, and the result is
as correct as the runtime's locale data. Where it does not — some embedded
and edge runtimes ship without it — the English forms are produced instead,
so the shape of the output never changes with the host, only the language.

## Parameters

- **items** `string[]` — The strings to join.
- **options** `FormatListOptions` _(optional)_ — The options object.

## Returns

`string` — The joined string, empty for an empty list.

## Throws

- `RangeError` — If `type` or `style` is not one of its allowed values.

## Examples

```js
formatList(['a', 'b', 'c']) //=> 'a, b, and c'
formatList(['a', 'b']) //=> 'a and b'
formatList(['a']) //=> 'a'
formatList([]) //=> ''
```

```js
formatList(['a', 'b', 'c'], { type: 'disjunction' }) //=> 'a, b, or c'
formatList(['a', 'b', 'c'], { type: 'unit' }) //=> 'a, b, c'
formatList(['a', 'b', 'c'], { style: 'short' }) //=> 'a, b, & c'
```

```js
formatList(['a', 'b', 'c'], { locale: 'de-DE' }) //=> 'a, b und c'
```
