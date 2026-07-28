# semverIncrement

Increments a version, returning the new version string.

The plain releases (`major`, `minor`, `patch`) resolve an in-progress pre-release rather than skipping past it, so `1.0.0-rc.1` majors to `1.0.0`, not `2.0.0`. Build metadata is dropped, since it does not carry over.

@param version - The version to increment.
@param release - One of `major`, `minor`, `patch`, `premajor`, `preminor`, `prepatch` or `prerelease`.
@param identifier - The pre-release identifier, such as `'beta'`.
@returns The incremented version string.
@throws If the version is invalid or the release is unknown.

### Example

```js
semverIncrement('1.2.3', 'minor') //=> '1.3.0'
semverIncrement('1.0.0-rc.1', 'major') //=> '1.0.0'

semverIncrement('1.2.3', 'preminor', 'beta') //=> '1.3.0-beta.0'
semverIncrement('1.3.0-beta.0', 'prerelease') //=> '1.3.0-beta.1'
```
