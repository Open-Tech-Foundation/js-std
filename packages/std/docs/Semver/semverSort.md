# semverSort

Sorts version strings by SemVer precedence, returning a new array.

A plain `sort` orders versions as strings, which puts `1.10.0` before `1.2.3`. This orders them numerically per segment.

@param versions - The versions to sort.
@param order - The sort order, `'asc'` by default.
@returns A new sorted array.
@throws If any string is not a valid SemVer version.

### Example

```js
semverSort(['1.10.0', '1.2.3', '1.0.0'])
//=> ['1.0.0', '1.2.3', '1.10.0']

semverSort(['1.0.0', '1.0.0-rc.1', '1.0.0-alpha'], 'desc')
//=> ['1.0.0', '1.0.0-rc.1', '1.0.0-alpha']
```
