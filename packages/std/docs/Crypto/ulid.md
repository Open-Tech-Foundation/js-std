# ulid

Generates a ULID: a 128-bit, lexicographically sortable identifier.

The first 48 bits are the timestamp in milliseconds and the remaining 80 are
random, encoded together as 26 characters of Crockford's Base32. Because the
time leads and the encoding preserves order, sorting the strings sorts by
creation time — no separate column, and no parsing to compare two of them.

It is 26 characters against a UUID's 36, uses no hyphens, and is safe in a URL,
a filename and a double-click selection. The alphabet leaves out `I`, `L`, `O`
and `U`, so nothing in it can be misread as a digit or as `V`.

A ULID is not a UUID and will not pass a UUID column or validator. Reach for
`uuidv7` when the shape has to be a UUID; the two carry the same idea.

Ordering holds *between* milliseconds, not within one: two ULIDs made in the
same millisecond differ only in their random half, so their relative order is
arbitrary. That is the behaviour the specification defines for this function.

@param {number} [seedTime=Date.now()] The timestamp to encode, in milliseconds.
@returns {string} A 26-character ULID.
@throws {RangeError} If `seedTime` is not an integer within the 48-bit range.

### Example

```js
ulid() //=> '01ARZ3NDEKTSV4RRFFQ69G5FAV'

// Sorting the strings sorts by creation time.
[ulid(), ulid(), ulid()].sort()

// A fixed time gives a fixed 10-character prefix.
ulid(1469918176385).slice(0, 10) //=> '01ARYZ6S41'
```
