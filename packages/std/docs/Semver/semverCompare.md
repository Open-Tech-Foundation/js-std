# semverCompare

Compares two versions by SemVer precedence, for use as an `Array#sort`
comparator.

Build metadata is ignored, as the specification requires, so `1.0.0+a` and
`1.0.0+b` compare equal. A pre-release ranks below the release it precedes.

## Parameters

- **a** `string` — The first version.
- **b** `string` — The second version.

## Returns

`-1 | 0 | 1` — `-1` if `a` is lower, `1` if `a` is higher, `0` if equal.

## Throws

- `TypeError` — If either string is not a valid SemVer version.

## Examples

```js
semverCompare('1.2.3', '1.10.0') //=> -1
semverCompare('2.0.0', '2.0.0-rc.1') //=> 1
semverCompare('1.0.0+a', '1.0.0+b') //=> 0
```

```js
['1.10.0', '1.2.3'].sort(semverCompare) //=> ['1.2.3', '1.10.0']
```
