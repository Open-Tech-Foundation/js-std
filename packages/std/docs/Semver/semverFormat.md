# semverFormat

Formats a parsed version back into a [Semantic Versioning 2.0.0](https://semver.org) string.

The inverse of `semverParse`, less the tolerated `v` prefix — the output is always canonical.

@param version - The parsed version.
@returns The version string.

### Example

```js
semverFormat({ major: 1, minor: 2, patch: 3, prerelease: [], build: [] })
//=> '1.2.3'

semverFormat(semverParse('v2.0.0-alpha.1+build.5')) //=> '2.0.0-alpha.1+build.5'
```
