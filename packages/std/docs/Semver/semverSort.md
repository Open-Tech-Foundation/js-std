# semverSort

Sorts version strings by SemVer precedence, returning a new array.

A plain `sort` orders versions as strings, which puts `1.10.0` before
`1.2.3`. This orders them numerically per segment.

## Parameters

- **versions** `string[]` — The versions to sort.
- **order** `OrderType` _(default: `'asc'`)_ — The sort order.

## Returns

`string[]` — A new sorted array.

## Throws

- `TypeError` — If any string is not a valid SemVer version.

## Examples

```js
semverSort(['1.10.0', '1.2.3', '1.0.0'])
//=> ['1.0.0', '1.2.3', '1.10.0']
```

```js
semverSort(['1.0.0', '1.0.0-rc.1', '1.0.0-alpha'], 'desc')
//=> ['1.0.0', '1.0.0-rc.1', '1.0.0-alpha']
```
