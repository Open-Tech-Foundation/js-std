# semverMinSatisfying

Returns the lowest version in the list that satisfies the range.

The counterpart to `semverMaxSatisfying`, and what you want when testing
against the oldest supported dependency rather than the newest.

## Parameters

- **versions** `string[]` — The versions to choose from.
- **range** `string` — The range to satisfy.
- **options** `SemverSatisfiesOptions` _(optional)_ — The matching options.

## Returns

`string|null` — The lowest satisfying version, or `null` if none do.

## Throws

- `TypeError` — If any version, or the range, cannot be parsed.

## Example

```js
semverMinSatisfying(['1.0.0', '1.2.3', '2.0.0'], '^1.0.0') //=> '1.0.0'
semverMinSatisfying(['1.0.0', '2.0.0'], '^3.0.0') //=> null
```
