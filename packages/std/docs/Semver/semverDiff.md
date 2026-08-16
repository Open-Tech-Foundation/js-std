# semverDiff

Reports which kind of release separates two versions.

This is the inverse question to `semverIncrement`: given where you were and
where you are, what sort of bump was that? Answering it from the strings by
hand is where the pre-release rules bite, so it is easy to get wrong.

Order does not matter — the two are compared by precedence and the answer
describes the distance, not the direction. Build metadata is ignored, as it
is everywhere else, so `1.0.0+a` and `1.0.0+b` differ by nothing.

Moving off a pre-release onto its release reports the release that landed
rather than `'prerelease'`: `1.0.0-rc.1` to `1.0.0` is a `'major'`, because
reaching `1.0.0` is what the pre-releases were leading to.

## Parameters

- **a** `string` — The first version.
- **b** `string` — The second version.

## Returns

`SemverRelease|null` — The release kind, or `null` if they are equal.

## Throws

- `TypeError` — If either string is not a valid SemVer version.

## Examples

```js
semverDiff('1.2.3', '2.0.0') //=> 'major'
semverDiff('1.2.3', '1.3.0') //=> 'minor'
semverDiff('1.2.3', '1.2.4') //=> 'patch'
semverDiff('1.2.3', '1.2.3') //=> null
```

```js
semverDiff('1.2.3', '2.0.0-rc.1') //=> 'premajor'
semverDiff('1.3.0-beta.0', '1.3.0-beta.1') //=> 'prerelease'
semverDiff('1.0.0-rc.1', '1.0.0') //=> 'major'
```
