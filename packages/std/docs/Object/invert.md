# invert

Swaps the keys and values of an object.

Values become keys, so they are coerced to strings the same way any property
name is. The mapping is only reversible when the values are unique — where
two keys share a value the later one wins, and the earlier key is lost.

Because values become keys, a value of `__proto__`, `constructor` or
`prototype` is refused and its entry dropped, as writing one would set the
result's prototype rather than a property on it.

## Parameters

- **obj** `T` — The source object.

## Returns

`Record<string, string>` — The inverted object.

## Examples

```js
invert({ a: 1, b: 2 }) //=> { '1': 'a', '2': 'b' }
```

```js
// Turning a code table into a reverse lookup.
const STATUS = { ok: 200, notFound: 404 };
invert(STATUS) //=> { '200': 'ok', '404': 'notFound' }
```

```js
// Duplicate values collapse, keeping the last key.
invert({ a: 1, b: 1 }) //=> { '1': 'b' }
```
