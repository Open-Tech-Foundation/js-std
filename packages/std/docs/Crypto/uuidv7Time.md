# uuidv7Time

Reads the timestamp back out of a UUID v7.

A v7 leads with a 48-bit count of milliseconds since the Unix epoch — that is
what makes it sortable — but the value is only useful if it can be got back
out, and picking it out of the string by hand means knowing that it is the
first twelve hex digits with a hyphen in the middle of them.

Only version 7 carries a timestamp in this layout, so anything else is rejected
rather than decoded into a number that would mean nothing. Guard with
`isUUID(id, 7)` when the input is untrusted.

@param {string} uuid The UUID v7 to read.
@returns {number} Milliseconds since the Unix epoch, as `Date.now()` gives.
@throws {TypeError} If the value is not a UUID v7.

### Example

```js
const id = uuidv7();

uuidv7Time(id) //=> 1769000000000
new Date(uuidv7Time(id)) //=> the moment it was generated
```
