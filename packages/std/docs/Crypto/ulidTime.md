# ulidTime

Reads the timestamp back out of a ULID.

A ULID leads with a 48-bit count of milliseconds since the Unix epoch — that
is what makes it sortable — held in the first ten characters. Decoding it
means knowing the alphabet and that the most significant character comes
first, which is the sort of thing worth having in one place.

Guard with `isULID` when the input is untrusted; a malformed string is
rejected rather than decoded into a number that would mean nothing.

## Parameters

- **id** `string` — The ULID to read.

## Returns

`number` — Milliseconds since the Unix epoch, as `Date.now()` gives.

## Throws

- `TypeError` — If the value is not a ULID.

## Examples

```js
const id = ulid();
ulidTime(id) //=> 1769000000000
new Date(ulidTime(id)) //=> the moment it was generated
```

```js
ulidTime('01ARYZ6S41TSV4RRFFQ69G5FAV') //=> 1469918176385
```
