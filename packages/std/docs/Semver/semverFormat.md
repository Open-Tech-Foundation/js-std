# semverFormat

Formats a parsed version back into a
[Semantic Versioning 2.0.0](https://semver.org) string.

The inverse of `semverParse`, less the tolerated `v` prefix — the output is
always canonical.

## Parameters

- **version** `Semver` — The parsed version.

## Returns

`string` — The version string.

## Examples

```js
semverFormat({ major: 1, minor: 2, patch: 3, prerelease: [], build: [] })
//=> '1.2.3'
```

```js
semverFormat(semverParse('v2.0.0-alpha.1+build.5')) //=> '2.0.0-alpha.1+build.5'
```
