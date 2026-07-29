# DateTime

An immutable date and time in an IANA time zone.

Backed by the TC39 Temporal API where the runtime provides it, and by `Intl.DateTimeFormat` everywhere else. Both paths implement the same semantics, so behaviour does not change with the host. Time-zone support needs no bundled database and no dependency.

Months and days are 1-based and `dayOfWeek` runs 1 (Monday) to 7 (Sunday), following Temporal and ISO-8601 rather than the legacy `Date`. Every method returns a new instance; nothing mutates.

@param input - An ISO-8601 string, epoch milliseconds, a `Date`, another `DateTime`, or a wall-clock fields object. Omit it for the current time.
@param options - `timeZone` (IANA id, default `'UTC'`) and `disambiguation` (`'compatible'` | `'earlier'` | `'later'` | `'reject'`, default `'compatible'`).

Parsing is strict ISO-8601 and throws a `RangeError` rather than yielding an `Invalid Date`, because `Date.parse` is implementation-defined outside the ISO subset and disagrees across runtimes.

### Statics

- `DateTime.now(timeZone?)` — the current time.
- `DateTime.compare(a, b)` — comparator for `Array.prototype.sort`.
- `DateTime.hasTemporal` — whether this runtime provides Temporal.
- `DateTime.fromTemporal(value)` — from a `Temporal.ZonedDateTime` or `Temporal.Instant`.

### Getters

`year`, `month`, `day`, `hour`, `minute`, `second`, `millisecond`, `dayOfWeek`, `dayOfYear`, `weekOfYear`, `weekYear`, `daysInMonth`, `daysInYear`, `inLeapYear`, `timeZone`, `offset`, `offsetMs`, `epochMs`.

### Methods

- `add(duration)` / `subtract(duration)` — calendar and/or exact units.
- `with(fields)` — replace wall-clock fields, keeping the zone.
- `withTimeZone(tz)` — keep the instant, move the clock.
- `startOf(unit)` / `endOf(unit)` — truncate. Weeks start on Monday; `endOf` returns the last millisecond.
- `diff(other, unit)` — signed `this − other`.
- `compare(other)`, `equals(other)`, `isBefore(other)`, `isAfter(other)`, `isBetween(start, end)`.
- `format(pattern, locale?)`, `toLocaleString(locale?, options?)`.
- `toISOString()`, `toJSON()`, `toString()`, `toDate()`, `valueOf()`, `toTemporal()`.

Units are `'year'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'` and `'millisecond'`.

### Example

```js
const dt = new DateTime('2026-03-08T01:30:00', { timeZone: 'America/New_York' });

dt.format('yyyy-MM-dd HH:mm ZZ'); //=> '2026-03-08 01:30 -05:00'
dt.add({ hours: 1 }).format('HH:mm ZZ'); //=> '03:00 -04:00'  (DST gap skipped)
dt.add({ days: 1 }).format('HH:mm ZZ'); //=> '01:30 -04:00'  (wall clock kept)
dt.withTimeZone('Asia/Kolkata').format('yyyy-MM-dd HH:mm'); //=> '2026-03-08 12:00'
dt.startOf('month').toISOString(); //=> '2026-03-01T00:00:00.000-05:00[America/New_York]'
```

Calendar units (`years`, `months`, `weeks`, `days`) move the wall clock, so adding a day across a DST boundary keeps the local time and may advance 23 or 25 real hours. Exact units (`hours` and below) move the instant. Month arithmetic clamps:

```js
new DateTime('2026-01-31').add({ months: 1 }).format('yyyy-MM-dd'); //=> '2026-02-28'
```

`diff` counts whole units for `year`, `month`, `week` and `day`, truncated toward zero, and returns fractional elapsed time for `hour` and below.

### DST disambiguation

A wall-clock time can be missing or repeated at a transition:

```js
const wall = '2026-03-08T02:30:00'; // never happens in New York
const timeZone = 'America/New_York';

new DateTime(wall, { timeZone }).format('HH:mm ZZ');
//=> '03:30 -04:00'  — 'compatible' shifts a gap forward

new DateTime(wall, { timeZone, disambiguation: 'earlier' }).format('HH:mm ZZ');
//=> '01:30 -05:00'

new DateTime(wall, { timeZone, disambiguation: 'reject' }); // throws RangeError
```

For an overlap — a wall time that happens twice — `'compatible'` takes the earlier instant.

### Format tokens

| Token                 | Output                | Token    | Output           |
| --------------------- | --------------------- | -------- | ---------------- |
| `yyyy` `yy`           | `2026` `26`           | `HH` `H` | hour, 0–23       |
| `MMMM` `MMM` `MM` `M` | `July` `Jul` `07` `7` | `hh` `h` | hour, 1–12       |
| `dd` `d`              | `29` `29`             | `mm` `m` | minute           |
| `EEEE` `EEE`          | `Wednesday` `Wed`     | `ss` `s` | second           |
| `DDD`                 | day of year           | `SSS`    | millisecond      |
| `ww`                  | ISO week              | `a`      | `AM` / `PM`      |
| `zzz`                 | `Asia/Kolkata`        | `ZZ` `Z` | `+05:30` `+0530` |

Text in single quotes is literal. Only month and weekday names depend on `locale`; everything else is locale-independent, so a pattern produces the same bytes on every runtime.

### Runtime support

The whole API works on every runtime — only the machinery underneath changes.

| Runtime                                    | Backend  |
| ------------------------------------------ | -------- |
| Node.js 26+, Deno, ES-Runtime              | Temporal |
| Chrome 144+, Edge 144+, Firefox 139+       | Temporal |
| Node.js 24 / 25 with `--harmony-temporal`  | Temporal |
| Node.js 22 and earlier, Bun, LLRT, Safari  | `Intl`   |

`toTemporal` and `DateTime.fromTemporal` are the only members that need Temporal and throw where it is absent; check `DateTime.hasTemporal` first.

On LLRT, `Intl` ignores locales and component options, so month names, weekday names and `toLocaleString` do not work there. Numeric tokens, time zones and all arithmetic are unaffected.
