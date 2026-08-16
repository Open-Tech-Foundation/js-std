<!-- handwritten -->

# Duration

An immutable length of time.

Calendar units — years, months, weeks and days — are carried as written and never silently converted, because none of them has a fixed length: a month is 28 to 31 days and a day across a DST boundary is 23 or 25 hours. Anything that would need that conversion takes a `relativeTo` [DateTime](./DateTime.md) to measure from. Durations made only of hours and below need no such anchor.

Fields are stored exactly as given, so `PT90S` round-trips as `PT90S` rather than becoming `PT1M30S`. Balancing is opt-in through `round`. Every method returns a new instance; nothing mutates.

## Parameters

- **input** — An ISO-8601 duration string, a count of milliseconds, a fields object, or another `Duration`. Omit it for a zero duration.

Every non-zero field must share one sign, and mixed signs throw a `RangeError`. ISO-8601 signs the duration as a whole and has no way to write "a month minus two hours", so allowing it would make `toString` lossy. Arithmetic still resolves across the boundary, since a sum has one direction even when its operands could not sit side by side.

### Statics

- `Duration.from(input)` — coerce anything duration-shaped, passing a `Duration` through.
- `Duration.between(a, b, options?)` — the duration from one `DateTime` to another. `largestUnit` defaults to `'day'`.
- `Duration.compare(a, b, options?)` — comparator for `Array.prototype.sort`.
- `Duration.fromTemporal(value)` — from a `Temporal.Duration`.

### Getters

`years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`, `milliseconds`, `sign`, `isZero`.

### Methods

- `add(other, options?)` / `subtract(other, options?)` — combine two durations.
- `with(fields)` — replace the named fields.
- `negated()` / `abs()` — flip or drop the sign.
- `total(unit, options?)` — the whole duration in one unit, fraction included.
- `round(options?)` — round to a unit and rebalance. Takes `smallestUnit`, `largestUnit`, `roundingMode` and `relativeTo`.
- `compare(other, options?)` / `equals(other, options?)` — order and compare by value, so `PT60M` equals `PT1H`.
- `format(pattern)` — locale-independent tokens.
- `toLocaleString(locale?, options?)`, `toRelative(locale?, options?)`.
- `toString()`, `toJSON()`, `toObject()`, `toTemporal()`.

`valueOf()` always throws: a duration carrying calendar units has no single numeric value, so `d1 > d2` would compare something meaningless. Use `compare` to order and `total` to measure.

Units are `'year'`, `'month'`, `'week'`, `'day'`, `'hour'`, `'minute'`, `'second'` and `'millisecond'`. Rounding modes are `'trunc'`, `'floor'`, `'ceil'` and `'halfExpand'`.

## Example

```js
// Parse and serialise the wire format
new Duration('PT1H30M').total('minute') //=> 90
new Duration({ hours: 1, minutes: 30 }).toString() //=> 'PT1H30M'

// Measure two points against the calendar, not a fixed day length
const a = new DateTime('2026-03-07T12:00', { timeZone: 'America/New_York' });
const b = new DateTime('2026-03-08T12:00', { timeZone: 'America/New_York' });

Duration.between(a, b).toString() //=> 'P1D'   the calendar day
Duration.between(a, b, { largestUnit: 'hour' }).toString() //=> 'PT23H'  the real time

// Calendar units need an anchor, because their length depends on where they fall
new Duration('P1M').total('day', { relativeTo: new DateTime('2026-02-01') }) //=> 28
new Duration('P1M').total('day', { relativeTo: new DateTime('2026-03-01') }) //=> 31

// Round and format
new Duration('PT90S').round({ largestUnit: 'minute' }).toString() //=> 'PT1M30S'
new Duration('PT1H30M').format('H:mm:ss') //=> '1:30:00'
new Duration('PT1H30M').toLocaleString('en-US') //=> '1 hr, 30 min'
new Duration({ hours: -3 }).toRelative('en-US') //=> '3 hours ago'
```
