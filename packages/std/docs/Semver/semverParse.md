# semverParse

Parses a [Semantic Versioning 2.0.0](https://semver.org) string.

A leading `v` and surrounding whitespace are tolerated, because that is how versions appear in git tags and changelogs. Numeric pre-release identifiers are returned as numbers so they compare numerically.

Use `semverIsValid` when you want a boolean instead of an exception.

@param version - The version string to parse.
@returns The parsed version.
@throws If the string is not a valid SemVer version.

### Example

```js
semverParse('1.2.3')
//=> { major: 1, minor: 2, patch: 3, prerelease: [], build: [] }

semverParse('v2.0.0-alpha.1+build.5')
//=> { major: 2, minor: 0, patch: 0, prerelease: ['alpha', 1], build: ['build', '5'] }
```
