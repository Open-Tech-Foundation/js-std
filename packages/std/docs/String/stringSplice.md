# stringSplice

Removes characters from a string and inserts another in their place, following `Array.prototype.splice`.

Indices count UTF-16 code units, as `slice` and `indexOf` do, so a position taken from either can be passed straight in. A boundary landing inside a surrogate pair is widened to cover the whole character, so the result is always well-formed.

`start` must be a finite integer; a negative one counts back from the end. Omit `deleteCount` to remove everything from `start` onwards.

@param {string} str The source string.
@param {number} [start=0] The index to start changing the string at.
@param {number} [deleteCount] The number of characters to remove.
@param {string} [insert=''] The string to insert at `start`.
@returns {string} The modified string.

### Example

```js
// Replace a range.
stringSplice('2026-07-30', 5, 2, '08') //=> '2026-08-30'

// Insert, by removing nothing.
stringSplice('SELECT * FROM users', 19, 0, ' LIMIT 10') //=> 'SELECT * FROM users LIMIT 10'

// Delete, by inserting nothing.
stringSplice('2026-07-30T09:15:00Z', -1) //=> '2026-07-30T09:15:00'

// Mask, where the replacement need not match the removed length.
stringSplice('4111111111111111', 4, 8, '••••') //=> '4111••••1111'

// A negative start counts back from the end.
stringSplice('report.txt', -3, 3, 'csv') //=> 'report.csv'
```
