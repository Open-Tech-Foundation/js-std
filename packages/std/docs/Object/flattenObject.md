# flattenObject

Flattens a nested object into a single level, keyed by the path to each
value.

The keys are the path grammar the rest of this module speaks — dots between
properties and brackets around indices — so every key of the result can be
handed straight to `get`, `set` or `toPath` against the original object.

Nested plain objects and arrays are walked; everything else is a value,
including a `Date`, a `Map`, a class instance and `null`. An empty object or
array has no leaves to stand for it and so is kept as a value, since dropping
it would lose a key that was present.

A key already containing a `.` or a `[` cannot be told apart from the path
built around it: `{ 'a.b': 1 }` flattens to the same `'a.b'` that
`{ a: { b: 1 } }` does. That is a property of the format rather than of this
function — `unflattenObject` reads both back as the nested form.

`__proto__`, `constructor` and `prototype` are skipped at every depth, so
that no key of the result can be replayed against `set` to reach a
prototype.

## Parameters

- **obj** `object` — The object to flatten.

## Returns

`Record<string, unknown>` — A one-level object keyed by path.

## Examples

```js
flattenObject({ a: { b: { c: 1 } } }) //=> { 'a.b.c': 1 }
```

```js
flattenObject({ a: [1, 2] }) //=> { 'a[0]': 1, 'a[1]': 2 }
```

```js
flattenObject({ a: {}, b: 1 }) //=> { a: {}, b: 1 }
```
