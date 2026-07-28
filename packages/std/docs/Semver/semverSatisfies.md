# semverSatisfies

Checks whether a version satisfies a range.

Supports the full npm range grammar: comparators (`>`, `>=`, `<`, `<=`, `=`), caret (`^1.2.3`) and tilde (`~1.2.3`) ranges, wildcards (`1.x`, `1.2.*`, `*`), hyphen ranges (`1.2.3 - 2.3.4`), whitespace-joined sets that must all hold, and `||` between alternatives.

A pre-release version only satisfies a range when some comparator in the matching set names a pre-release on the same `major.minor.patch` — so `2.0.0-alpha` does not satisfy `>=1.0.0`. Pass `{ includePrerelease: true }` to compare on version precedence alone.

@param version - The version to test.
@param range - The range to test against.
@param options - Set `includePrerelease` to match pre-releases anywhere.
@returns `true` if the version satisfies the range.
@throws If the version or the range cannot be parsed.

### Example

```js
semverSatisfies('1.2.5', '^1.2.3') //=> true
semverSatisfies('2.0.0', '^1.2.3') //=> false
semverSatisfies('1.2.7', '~1.2.3') //=> true

semverSatisfies('1.5.0', '>=1.2.3 <2.0.0 || 3.x') //=> true
semverSatisfies('1.2.3', '1.2.3 - 2.3.4') //=> true

semverSatisfies('2.0.0-alpha', '>=1.0.0') //=> false
semverSatisfies('2.0.0-alpha', '>=1.0.0', { includePrerelease: true }) //=> true
```
