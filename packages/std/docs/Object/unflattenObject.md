# unflattenObject

Expands a one-level object keyed by path back into a nested one.

The inverse of `flattenObject`, and the reader for the flat shapes that
arrive from elsewhere — form bodies, query strings, environment maps and the
dotted keys configuration files use.

Keys are parsed with `toPath`, so both `'a.b'` and `'a[0].b'` are understood,
and each is written with `set`. A level whose keys are all indices becomes an
array, which is the rule `set` already applies within a path and is applied
here to the root as well — so `{ '[0]': 'a' }` gives `['a']` rather than
`{ 0: 'a' }`, and a flattened array survives the round trip.

Keys are applied in the order the object gives them. Where two disagree — one
naming a branch the other names a leaf — the later wins for the leaf and is
ignored for the branch, matching `set`.

`__proto__`, `constructor` and `prototype` are refused as path segments, as
they are everywhere in this module. A flat object is very often untrusted
input, which is the whole reason this function exists, and expanding one of
those keys is how a prototype gets polluted.

## Parameters

- **obj** `Record<string, unknown>` — The flat object to expand.

## Returns

`Record<string, unknown>|unknown[]` — The nested object.

## Examples

```js
unflattenObject({ 'a.b.c': 1 }) //=> { a: { b: { c: 1 } } }
```

```js
unflattenObject({ 'a[0]': 1, 'a[1]': 2 }) //=> { a: [1, 2] }
```

```js
unflattenObject({ 'user.name': 'Tom', 'user.age': 30 })
//=> { user: { name: 'Tom', age: 30 } }
```
