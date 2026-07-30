# isUUID

Checks whether a value is a UUID.

The counterpart to `uuidv4` and `uuidv7`, and the more common operation of the
two: an identifier arriving from a route parameter, a form or another service
has to be checked before it is trusted, and a bare `8-4-4-4-12` hex test is not
that check. It admits strings no generator produces, because it ignores the
version and variant bits the format actually reserves.

Versions 1 to 8 are recognised, following RFC 9562 rather than the older RFC
4122 — this module emits version 7, which RFC 4122 has no concept of, so the
narrower rule would reject its own output. The Nil and Max UUIDs are accepted
as the two special forms that document defines; neither carries a version, so
neither satisfies a `version` filter.

Case-insensitive, as the specification requires. Hyphens must be present and in
place: a bare 32-character hex string is not a UUID.

@param {unknown} val The value to check.
@param {number} [version] Require this exact version, 1 to 8.
@returns {boolean} True if the value is a UUID.
@throws {RangeError} If `version` is given and is not an integer from 1 to 8.

### Example

```js
isUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479') //=> true
isUUID('not-a-uuid') //=> false
isUUID(42) //=> false

isUUID(uuidv7(), 7) //=> true
isUUID(uuidv4(), 7) //=> false

isUUID('00000000-0000-0000-0000-000000000000') //=> true  the Nil UUID
isUUID('00000000-0000-0000-0000-000000000000', 4) //=> false
```
