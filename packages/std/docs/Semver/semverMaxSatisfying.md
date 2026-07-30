# semverMaxSatisfying

Returns the highest version in the list that satisfies the range.

This is what resolving a dependency comes down to: a registry hands back every
published version and the range picks one. `semverSatisfies` answers it for a
single version, and doing the rest by hand means sorting the whole list when
only the maximum is wanted.

@param {string[]} versions The versions to choose from.
@param {string} range The range to satisfy.
@param {SemverSatisfiesOptions} [options] The matching options.
@returns {string|null} The highest satisfying version, or `null` if none do.
@throws {TypeError} If any version, or the range, cannot be parsed.

### Example

```js
semverMaxSatisfying(['1.0.0', '1.2.3', '2.0.0'], '^1.0.0') //=> '1.2.3'
semverMaxSatisfying(['1.0.0', '2.0.0'], '^3.0.0') //=> null

semverMaxSatisfying(['1.0.0', '1.1.0-rc.1'], '^1.0.0') //=> '1.0.0'
semverMaxSatisfying(['1.0.0', '1.1.0-rc.1'], '^1.0.0', {
  includePrerelease: true,
}) //=> '1.1.0-rc.1'
```
