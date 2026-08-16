# semverIncrement

Increments a version, returning the new version string.

The plain releases (`major`, `minor`, `patch`) resolve an in-progress
pre-release rather than skipping past it, so `1.0.0-rc.1` majors to `1.0.0`,
not `2.0.0`. Build metadata is dropped, since it does not carry over.

## Parameters

- **version** `string` — The version to increment.
- **release** `SemverRelease` — The kind of increment to apply.
- **identifier** `string` _(optional)_ — The pre-release identifier, such as `'beta'`.

## Returns

`string` — The incremented version string.

## Throws

- `TypeError` — If the version is invalid or the release is unknown.

## Examples

```js
semverIncrement('1.2.3', 'minor') //=> '1.3.0'
semverIncrement('1.0.0-rc.1', 'major') //=> '1.0.0'
```

```js
semverIncrement('1.2.3', 'preminor', 'beta') //=> '1.3.0-beta.0'
semverIncrement('1.3.0-beta.0', 'prerelease') //=> '1.3.0-beta.1'
```
