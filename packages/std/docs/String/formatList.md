# formatList

Joins a list of strings into readable prose.

`items.join(', ')` gives `'a, b, c'`, which is not a sentence. This gives
`'a, b, and c'` — with the connector, the punctuation before it and the
separate form a two-item list takes, all of which differ by language and none
of which are worth hand-rolling.

Where the runtime provides `Intl.ListFormat` it is used, and the result is as
correct as the runtime's locale data. Where it does not — some embedded and
edge runtimes ship without it — the English forms are produced instead, so the
shape of the output never changes with the host, only the language.

@param {string[]} items The strings to join.
@param {FormatListOptions} [options] The options object.
@returns {string} The joined string, empty for an empty list.
@throws {RangeError} If `type` or `style` is not one of its allowed values.

### Example

```js
formatList(['a', 'b', 'c']) //=> 'a, b, and c'
formatList(['a', 'b']) //=> 'a and b'
formatList([]) //=> ''

formatList(['a', 'b', 'c'], { type: 'disjunction' }) //=> 'a, b, or c'
formatList(['a', 'b', 'c'], { type: 'unit' }) //=> 'a, b, c'
formatList(['a', 'b', 'c'], { style: 'short' }) //=> 'a, b, & c'

formatList(['a', 'b', 'c'], { locale: 'de-DE' }) //=> 'a, b und c'
```
