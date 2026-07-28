# semverIsValid

Checks whether a string is a valid [Semantic Versioning 2.0.0](https://semver.org) version.

A leading `v` and surrounding whitespace are tolerated. Partial versions such as `1.2` and ranges such as `^1.2.3` are not versions, so they are rejected.

@param version - The string to check.
@returns `true` if the string is a valid SemVer version.

### Example

```js
semverIsValid('1.2.3') //=> true
semverIsValid('v1.2.3-beta.1') //=> true
semverIsValid('1.2') //=> false
semverIsValid('^1.2.3') //=> false
semverIsValid('01.2.3') //=> false
```
