# tryParseJSON

Safely parses a JSON string without throwing.

Returns the parsed value on success, or `fallback` (or `undefined` if no
fallback is given) when `text` is not a string or contains invalid JSON.
A `reviver` is passed through to `JSON.parse` when provided.
ISO 8601 date/time strings are revived to `DateTime` and durations to
`Duration` by default (native `Temporal` where available). Pass
`temporal:false` to disable.

## Parameters

- **text** — The JSON string to parse. Non-strings immediately return `fallback`.
- **fallback** — Value to return on failure. Defaults to `undefined`.
- **reviver** — Optional `JSON.parse` reviver, or options with `reviver`/`temporal`.

## Returns

The parsed value or the fallback.

## Example

```js
tryParseJSON('{"a":1}') //=> {a:1}
tryParseJSON('bad', {a:1}) //=> {a:1}
tryParseJSON(123, []) //=> []
tryParseJSON('{"a":1}', undefined, (k,v) => k==='a'? (v as number)*2 : v) //=> {a:2}
tryParseJSON('{"t":"2024-01-01T00:00:00.000Z"}') //=> {t: DateTime} — temporal by default
```
