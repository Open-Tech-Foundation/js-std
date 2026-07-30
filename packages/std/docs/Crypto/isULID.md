# isULID

Checks whether a value is a ULID.

Length alone is not the test. The alphabet excludes `I`, `L`, `O` and `U`, and
the first character is capped at `7` because ten Base32 characters hold fifty
bits where the timestamp is forty-eight — a string above `7ZZZZZZZZZ...` would
overflow it and is not a ULID however well-formed it looks.

Upper and lower case are both accepted: the canonical form is upper case, but
systems that lower-case their identifiers are common enough that rejecting them
would be unhelpful. The I/L/O substitutions Crockford permits a decoder to make
are not accepted, since a string carrying them is not one this module produced.

@param {unknown} val The value to check.
@returns {boolean} True if the value is a ULID.

### Example

```js
isULID('01ARZ3NDEKTSV4RRFFQ69G5FAV') //=> true
isULID(ulid()) //=> true

isULID('01ARZ3NDEKTSV4RRFFQ69G5FA') //=> false  25 characters
isULID('81ARZ3NDEKTSV4RRFFQ69G5FAV') //=> false  timestamp overflows
isULID('01ARZ3NDEKTSV4RRFFQ69G5FAI') //=> false  I is not in the alphabet
```
