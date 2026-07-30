# semverMinSatisfying

Returns the lowest version in the list that satisfies the range.

The counterpart to `semverMaxSatisfying`, and what you want when testing
against the oldest supported dependency rather than the newest.

@param {string[]} versions The versions to choose from.
@param {string} range The range to satisfy.
@param {SemverSatisfiesOptions} [options] The matching options.
@returns {string|null} The lowest satisfying version, or `null` if none do.
@throws {TypeError} If any version, or the range, cannot be parsed.

### Example

```js
semverMinSatisfying(['1.0.0', '1.2.3', '2.0.0'], '^1.0.0') //=> '1.0.0'
semverMinSatisfying(['1.0.0', '2.0.0'], '^3.0.0') //=> null
```
