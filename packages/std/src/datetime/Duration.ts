import DateTime from './DateTime';
import {
  durationFormatter,
  englishDuration,
  englishRelative,
  relativeFormatter,
} from './durationIntl';
import durationTokens from './durationTokens';
import { getTemporal } from './hasTemporal';
import parseDuration from './parseDuration';
import type {
  DateTimeUnit,
  DurationBetweenOptions,
  DurationLike,
  DurationRoundOptions,
  RelativeToOptions,
  RoundingMode,
} from './types';
import { DURATION_KEYS, MS, PLURAL, UNITS, assertUnit, isExact } from './units';

type Fields = Required<DurationLike>;
type ExactFields = Pick<
  Fields,
  'hours' | 'minutes' | 'seconds' | 'milliseconds'
>;

const ZERO: Fields = {
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
};

/**
 * Rejects fields that cannot be held as written.
 *
 * Every non-zero field must share one sign. This is not strictness for its own
 * sake: ISO-8601 puts a single sign in front of the whole duration and has no
 * way to write "a month minus two hours", so allowing it would make
 * `toString` lossy and leave `sign`, `abs` and `negated` undefined.
 */
function assertFields(fields: Fields): void {
  let sign = 0;

  for (const key of DURATION_KEYS) {
    const value = fields[key] as number;

    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      throw new RangeError(
        `The ${key} of a Duration must be a finite integer. Received: ${value}`,
      );
    }

    if (value === 0) {
      continue;
    }

    const current = value < 0 ? -1 : 1;

    if (sign === 0) {
      sign = current;
    } else if (current !== sign) {
      throw new RangeError(
        'Every non-zero field of a Duration must have the same sign, because ' +
          'ISO 8601 signs the duration as a whole. Anchor the mixed value to a ' +
          'DateTime instead, or express it in one direction.',
      );
    }
  }
}

function resolve(input: DurationLike): Fields {
  const fields = { ...ZERO };

  for (const key of DURATION_KEYS) {
    const value = input[key];

    if (value !== undefined) {
      fields[key] = value;
    }
  }

  return fields;
}

/**
 * Splits a millisecond span into whole exact units, largest first.
 *
 * A calendar `largestUnit` means the calendar walk has already run and handed
 * over the sub-day remainder, so hours is the ceiling.
 */
function balanceExact(ms: number, largestUnit: DateTimeUnit): ExactFields {
  const sign = ms < 0 ? -1 : 1;
  const from = isExact(largestUnit) ? largestUnit : 'hour';
  let rest = Math.abs(ms);
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (from === 'hour') {
    hours = Math.trunc(rest / MS.hour);
    rest -= hours * MS.hour;
  }

  if (from === 'hour' || from === 'minute') {
    minutes = Math.trunc(rest / MS.minute);
    rest -= minutes * MS.minute;
  }

  if (from !== 'millisecond') {
    seconds = Math.trunc(rest / MS.second);
    rest -= seconds * MS.second;
  }

  return {
    hours: hours * sign,
    minutes: minutes * sign,
    seconds: seconds * sign,
    milliseconds: rest * sign,
  };
}

const ROUNDING_MODES: RoundingMode[] = ['trunc', 'floor', 'ceil', 'halfExpand'];

function applyRounding(value: number, mode: RoundingMode): number {
  switch (mode) {
    case 'trunc':
      return Math.trunc(value);
    case 'floor':
      return Math.floor(value);
    case 'ceil':
      return Math.ceil(value);
    default:
      // `Math.round` breaks ties toward positive infinity, so -0.5 would go to
      // zero while 0.5 goes to one. Rounding the magnitude keeps the two
      // directions symmetrical.
      return Math.sign(value) * Math.round(Math.abs(value));
  }
}

/** The coarsest unit either duration actually uses. */
function largestUsed(a: Duration, b: Duration): DateTimeUnit {
  for (const unit of UNITS) {
    const key = PLURAL[unit];

    if (a[key] !== 0 || b[key] !== 0) {
      return unit;
    }
  }

  return 'millisecond';
}

/**
 * An immutable length of time.
 *
 * Calendar units — years, months, weeks and days — are carried as written and
 * never silently converted, because none of them has a fixed length: a month is
 * 28 to 31 days and a day across a DST boundary is 23 or 25 hours. Anything
 * that would need that conversion takes a `relativeTo` `DateTime` to measure
 * from. Durations made only of hours and below need no such anchor.
 *
 * Fields are stored exactly as given, so `PT90S` round-trips as `PT90S` rather
 * than becoming `PT1M30S`. Balancing is opt-in through `round`.
 *
 * Every method returns a new instance; nothing mutates.
 */
export default class Duration {
  readonly years: number;
  readonly months: number;
  readonly weeks: number;
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly milliseconds: number;

  /**
   * @param input An ISO-8601 duration string, a count of milliseconds, a
   *   fields object, or another `Duration`. Omit it for a zero duration.
   *
   * @throws {RangeError} On an unparseable string, a non-integer field, or
   *   fields whose signs disagree.
   * @throws {TypeError} On an unsupported input type.
   */
  constructor(input: DurationLike | Duration | string | number = {}) {
    let fields: Fields;

    if (typeof input === 'string') {
      fields = parseDuration(input);
    } else if (typeof input === 'number') {
      if (!Number.isFinite(input)) {
        throw new RangeError(
          `The milliseconds must be a finite number. Received: ${input}`,
        );
      }

      fields = { ...ZERO, milliseconds: Math.trunc(input) };
    } else if (typeof input === 'object' && input !== null) {
      fields = resolve(input);
    } else {
      throw new TypeError(
        'The input must be a string, number, Duration or fields object.',
      );
    }

    assertFields(fields);

    this.years = fields.years;
    this.months = fields.months;
    this.weeks = fields.weeks;
    this.days = fields.days;
    this.hours = fields.hours;
    this.minutes = fields.minutes;
    this.seconds = fields.seconds;
    this.milliseconds = fields.milliseconds;

    Object.freeze(this);
  }

  /** Coerces anything duration-shaped to a `Duration`, passing one through. */
  static from(input: DurationLike | Duration | string | number): Duration {
    return input instanceof Duration ? input : new Duration(input);
  }

  /**
   * The duration from `a` to `b`, negative when `b` is earlier.
   *
   * Calendar units are measured against the calendar rather than assumed, so a
   * day spanning a DST change counts as one day and a month as one month
   * whatever its length. `largestUnit` sets the coarsest unit used and defaults
   * to `'day'`, which keeps the result free of the ambiguity that months and
   * years carry.
   *
   * @throws {TypeError} When either argument is not a `DateTime`.
   */
  static between(
    a: DateTime,
    b: DateTime,
    options: DurationBetweenOptions = {},
  ): Duration {
    if (!(a instanceof DateTime) || !(b instanceof DateTime)) {
      throw new TypeError('Both arguments must be a DateTime.');
    }

    const largestUnit = options.largestUnit ?? 'day';

    assertUnit(largestUnit);

    if (isExact(largestUnit)) {
      return new Duration(balanceExact(b.epochMs - a.epochMs, largestUnit));
    }

    const fields = { ...ZERO };
    const start = UNITS.indexOf(largestUnit);
    let cursor = a;

    for (let i = start; i < UNITS.length; i++) {
      const unit = UNITS[i];

      if (isExact(unit)) {
        break;
      }

      // Weeks are produced only when asked for. Nobody reads a span as "two
      // months and two weeks", and mixing the two makes the day field mean
      // something different depending on the month — Temporal draws the same
      // line.
      if (unit === 'week' && largestUnit !== 'week') {
        continue;
      }

      // `diff` already truncates a whole-unit calendar difference toward zero
      // and knows about month lengths and DST, so the walk only has to advance
      // the cursor and let the next unit measure what is left.
      const count = b.diff(cursor, unit);

      if (count !== 0) {
        fields[PLURAL[unit]] = count;
        cursor = cursor.add({ [PLURAL[unit]]: count });
      }
    }

    return new Duration({
      ...fields,
      ...balanceExact(b.epochMs - cursor.epochMs, 'hour'),
    });
  }

  /** Orders two durations. Suitable as an `Array.prototype.sort` comparator. */
  static compare(
    a: DurationLike | Duration | string | number,
    b: DurationLike | Duration | string | number,
    options: RelativeToOptions = {},
  ): -1 | 0 | 1 {
    return Duration.from(a).compare(b, options);
  }

  /**
   * Converts from a `Temporal.Duration`.
   *
   * Microseconds and nanoseconds are dropped: a `Duration` resolves to
   * milliseconds, as `DateTime` does.
   *
   * @throws {Error} On a runtime without Temporal.
   */
  static fromTemporal(value: DurationLike): Duration {
    getTemporal();

    if (
      value === null ||
      typeof value !== 'object' ||
      typeof value.seconds !== 'number'
    ) {
      throw new TypeError('The value must be a Temporal.Duration.');
    }

    return new Duration(resolve(value));
  }

  /** `-1`, `0` or `1`. Every non-zero field shares this sign. */
  get sign(): -1 | 0 | 1 {
    for (const key of DURATION_KEYS) {
      const value = this[key];

      if (value !== 0) {
        return value < 0 ? -1 : 1;
      }
    }

    return 0;
  }

  /** Whether every field is zero. */
  get isZero(): boolean {
    return this.sign === 0;
  }

  /** Whether any calendar unit is in use, and so whether an anchor is needed. */
  private get hasCalendar(): boolean {
    return (
      this.years !== 0 ||
      this.months !== 0 ||
      this.weeks !== 0 ||
      this.days !== 0
    );
  }

  /** The exact part in milliseconds. Calendar fields are not represented. */
  private get exactMs(): number {
    return (
      this.hours * MS.hour +
      this.minutes * MS.minute +
      this.seconds * MS.second +
      this.milliseconds
    );
  }

  private anchor(options: RelativeToOptions, action: string): DateTime {
    const { relativeTo } = options;

    if (!(relativeTo instanceof DateTime)) {
      throw new RangeError(
        `${action} a Duration that uses years, months, weeks or days needs a relativeTo DateTime, because none of those units has a fixed length.`,
      );
    }

    return relativeTo;
  }

  /** Replaces the given fields, keeping the rest. */
  with(fields: DurationLike): Duration {
    return new Duration({ ...this.toObject(), ...fields });
  }

  /** Flips the sign of every field. */
  negated(): Duration {
    const fields = { ...ZERO };

    for (const key of DURATION_KEYS) {
      // Negating a zero would give `-0`, which serialises with a stray sign.
      if (this[key] !== 0) {
        fields[key] = -this[key];
      }
    }

    return new Duration(fields);
  }

  /** Drops the sign, giving the same length forwards. */
  abs(): Duration {
    const fields = { ...ZERO };

    for (const key of DURATION_KEYS) {
      fields[key] = Math.abs(this[key]);
    }

    return new Duration(fields);
  }

  /**
   * Adds another duration.
   *
   * Two durations of hours and below combine by arithmetic alone, and the
   * result is balanced. Once either side uses a calendar unit the sum depends
   * on where it lands, so `relativeTo` is required.
   *
   * @throws {RangeError} When a calendar unit is in play without `relativeTo`.
   */
  add(
    other: DurationLike | Duration | string | number,
    options: RelativeToOptions = {},
  ): Duration {
    const addend = Duration.from(other);

    if (!this.hasCalendar && !addend.hasCalendar) {
      return new Duration(balanceExact(this.exactMs + addend.exactMs, 'hour'));
    }

    const relativeTo = this.anchor(options, 'Adding to');
    const end = relativeTo.add(this.toObject()).add(addend.toObject());

    return Duration.between(relativeTo, end, {
      largestUnit: largestUsed(this, addend),
    });
  }

  /** Subtracts another duration. Equivalent to adding its negation. */
  subtract(
    other: DurationLike | Duration | string | number,
    options: RelativeToOptions = {},
  ): Duration {
    return this.add(Duration.from(other).negated(), options);
  }

  /**
   * The whole duration measured in one unit, fraction included.
   *
   * Needs no anchor while both the duration and the unit stay at hours or
   * below, since those lengths are fixed. Anything touching a calendar unit
   * depends on where it falls and so requires `relativeTo`.
   *
   * @param {DateTimeUnit} unit The unit to measure in.
   * @param {RelativeToOptions} [options] `relativeTo`, when calendar units apply.
   * @returns {number} The signed total, which may be fractional.
   *
   * @throws {RangeError} When a calendar unit is in play without `relativeTo`.
   */
  total(unit: DateTimeUnit, options: RelativeToOptions = {}): number {
    assertUnit(unit);

    if (!this.hasCalendar && isExact(unit)) {
      return this.exactMs / MS[unit];
    }

    const relativeTo = this.anchor(options, 'Measuring');
    const end = relativeTo.add(this.toObject());

    if (isExact(unit)) {
      return (end.epochMs - relativeTo.epochMs) / MS[unit];
    }

    if (end.epochMs === relativeTo.epochMs) {
      return 0;
    }

    // Whole units come from the calendar, so month lengths and DST are already
    // accounted for. What is left over is then measured against the unit that
    // would come next, which is the only length that makes the fraction mean
    // anything: half of a 31-day month is not half of a 28-day one.
    const whole = end.diff(relativeTo, unit);
    const step = end.epochMs > relativeTo.epochMs ? 1 : -1;
    const after = relativeTo.add({ [PLURAL[unit]]: whole });
    const next = relativeTo.add({ [PLURAL[unit]]: whole + step });
    const span = Math.abs(next.epochMs - after.epochMs);

    return whole + (end.epochMs - after.epochMs) / span;
  }

  /**
   * Rounds to a unit, and rebalances.
   *
   * `smallestUnit` sets what survives and `largestUnit` how coarsely the result
   * is expressed; giving only the latter balances without discarding anything.
   *
   * @param {DurationRoundOptions} [options] Rounding options.
   * @returns {Duration} A new, rounded duration.
   *
   * @throws {RangeError} On an unknown unit or mode, or when a calendar unit is
   *   in play without `relativeTo`.
   */
  round(options: DurationRoundOptions = {}): Duration {
    const smallestUnit = options.smallestUnit ?? 'millisecond';
    const roundingMode = options.roundingMode ?? 'halfExpand';

    assertUnit(smallestUnit);

    // Default to the coarsest unit already in use, so rounding does not invent
    // larger ones — but never finer than what is being rounded to, or a
    // duration rounded up to whole hours would have nowhere to put them.
    const used = largestUsed(this, this);
    const largestUnit =
      options.largestUnit ??
      (UNITS.indexOf(used) < UNITS.indexOf(smallestUnit) ? used : smallestUnit);

    assertUnit(largestUnit);

    if (!ROUNDING_MODES.includes(roundingMode)) {
      throw new RangeError(
        `The roundingMode must be one of ${ROUNDING_MODES.join(', ')}. Received: ${roundingMode}`,
      );
    }

    if (UNITS.indexOf(largestUnit) > UNITS.indexOf(smallestUnit)) {
      throw new RangeError(
        `The largestUnit (${largestUnit}) cannot be finer than the smallestUnit (${smallestUnit}).`,
      );
    }

    const count = applyRounding(
      this.total(smallestUnit, options),
      roundingMode,
    );
    const rounded = { [PLURAL[smallestUnit]]: count };

    if (isExact(smallestUnit) && isExact(largestUnit)) {
      return new Duration(balanceExact(count * MS[smallestUnit], largestUnit));
    }

    // Re-measuring from the anchor is what turns a flat count of one unit back
    // into a mixture of calendar ones.
    const relativeTo = this.anchor(options, 'Rounding');

    return Duration.between(relativeTo, relativeTo.add(rounded), {
      largestUnit,
    });
  }

  /**
   * Orders this against another duration.
   *
   * @throws {RangeError} When a calendar unit is in play without `relativeTo`.
   */
  compare(
    other: DurationLike | Duration | string | number,
    options: RelativeToOptions = {},
  ): -1 | 0 | 1 {
    const against = Duration.from(other);
    let a: number;
    let b: number;

    if (!this.hasCalendar && !against.hasCalendar) {
      a = this.exactMs;
      b = against.exactMs;
    } else {
      const relativeTo = this.anchor(options, 'Comparing');

      a = relativeTo.add(this.toObject()).epochMs;
      b = relativeTo.add(against.toObject()).epochMs;
    }

    if (a === b) {
      return 0;
    }

    return a < b ? -1 : 1;
  }

  /**
   * Whether both describe the same length of time.
   *
   * This compares value, not shape, so `PT60M` equals `PT1H`. Use `toString`
   * for identity of the fields as written.
   */
  equals(
    other: DurationLike | Duration | string | number,
    options: RelativeToOptions = {},
  ): boolean {
    return this.compare(other, options) === 0;
  }

  /** The fields as a plain object, with every unit present. */
  toObject(): Fields {
    return {
      years: this.years,
      months: this.months,
      weeks: this.weeks,
      days: this.days,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      milliseconds: this.milliseconds,
    };
  }

  /**
   * The ISO-8601 form, such as `'P1Y2M3DT4H5M6S'`. Zero is `'PT0S'`.
   *
   * Milliseconds appear as the fraction of the seconds component, ISO having no
   * unit of its own for them, so `{ milliseconds: 1500 }` writes as `'PT1.5S'`
   * and reads back as one second and five hundred milliseconds.
   */
  toString(): string {
    if (this.isZero) {
      return 'PT0S';
    }

    let date = '';
    let time = '';

    if (this.years !== 0) {
      date += `${Math.abs(this.years)}Y`;
    }

    if (this.months !== 0) {
      date += `${Math.abs(this.months)}M`;
    }

    if (this.weeks !== 0) {
      date += `${Math.abs(this.weeks)}W`;
    }

    if (this.days !== 0) {
      date += `${Math.abs(this.days)}D`;
    }

    if (this.hours !== 0) {
      time += `${Math.abs(this.hours)}H`;
    }

    if (this.minutes !== 0) {
      time += `${Math.abs(this.minutes)}M`;
    }

    const secondsMs = Math.abs(this.seconds * MS.second + this.milliseconds);

    if (secondsMs !== 0) {
      const whole = Math.trunc(secondsMs / MS.second);
      const fraction = secondsMs % MS.second;

      time +=
        fraction === 0
          ? `${whole}S`
          : `${whole}.${String(fraction).padStart(3, '0').replace(/0+$/, '')}S`;
    }

    return `${this.sign < 0 ? '-' : ''}P${date}${time === '' ? '' : `T${time}`}`;
  }

  /** The ISO-8601 form, so a `Duration` survives `JSON.stringify`. */
  toJSON(): string {
    return this.toString();
  }

  /**
   * Renders against a token pattern, identically on every runtime.
   *
   * Tokens are `y`/`yy`, `M`/`MM`, `w`/`ww`, `d`/`dd`, `H`/`HH`, `m`/`mm`,
   * `s`/`ss` and `SSS`; the doubled forms zero-pad. Text in single quotes is
   * literal and `''` is a quote.
   *
   * The coarsest exact token in the pattern sets where the time part is split,
   * so `'m:ss'` on ninety minutes reads `90:00` while `'H:mm:ss'` reads
   * `1:30:00`. Calendar fields are used as stored, nothing being able to
   * rebalance them without a reference point. A negative duration is prefixed
   * once with `-`.
   *
   * @param {string} pattern The token pattern.
   * @returns {string} The formatted duration.
   *
   * @example
   * new Duration('PT1H30M').format('H:mm:ss') //=> '1:30:00'
   */
  format(pattern: string): string {
    return durationTokens(this.toObject(), this.sign, pattern);
  }

  /**
   * Renders in the reader's language.
   *
   * Uses `Intl.DurationFormat` where the runtime provides it and falls back to
   * a short English rendering where it does not — it is recent enough to be
   * absent on LLRT and on Node.js before 23. Use `format` when the output has
   * to be identical everywhere.
   *
   * A zero duration renders as a zero count of seconds rather than the empty
   * string `Intl.DurationFormat` gives it, since a blank label is far more
   * likely to be a bug than an intent. Passing `secondsDisplay` yourself takes
   * precedence.
   *
   * @param {string} [locale] A BCP 47 tag. Defaults to the ambient locale.
   * @param {object} [options] `Intl.DurationFormat` options.
   * @returns {string} The formatted duration.
   *
   * @example
   * new Duration('PT1H30M').toLocaleString('en-US') //=> '1 hr, 30 min'
   */
  toLocaleString(locale?: string, options?: object): string {
    const resolved = this.isZero
      ? { secondsDisplay: 'always', ...options }
      : options;
    const formatter = durationFormatter(locale, resolved);

    return formatter === null
      ? englishDuration(this.toObject())
      : formatter.format(this.toObject());
  }

  /**
   * Renders as a point in time relative to now, such as `'3 hours ago'`.
   *
   * Only the coarsest unit in use is shown, which is what makes the phrasing
   * read naturally — `round` first to choose a different granularity. A
   * duration of milliseconds alone is expressed in seconds, that being the
   * finest unit `Intl.RelativeTimeFormat` has.
   *
   * @param {string} [locale] A BCP 47 tag. Defaults to the ambient locale.
   * @param {object} [options] `Intl.RelativeTimeFormat` options.
   * @returns {string} The formatted phrase.
   *
   * @example
   * new Duration({ hours: -3 }).toRelative('en-US') //=> '3 hours ago'
   * new Duration({ days: 2 }).toRelative('en-US')   //=> 'in 2 days'
   */
  toRelative(locale?: string, options?: object): string {
    let unit: DateTimeUnit = 'second';
    let value = 0;

    for (const candidate of UNITS) {
      const amount = this[PLURAL[candidate]];

      if (amount !== 0) {
        unit = candidate;
        value = amount;
        break;
      }
    }

    if (unit === 'millisecond') {
      unit = 'second';
      value /= MS.second;
    }

    const formatter = relativeFormatter(locale, options);

    return formatter === null
      ? englishRelative(value, unit)
      : formatter.format(value, unit);
  }

  /**
   * Converts to a `Temporal.Duration`.
   *
   * @throws {Error} On a runtime without Temporal.
   */
  toTemporal(): unknown {
    const temporal = getTemporal() as {
      Duration?: { from(item: unknown): unknown };
    };

    if (typeof temporal.Duration?.from !== 'function') {
      throw new Error('This runtime does not provide Temporal.Duration.');
    }

    return temporal.Duration.from(this.toString());
  }

  /**
   * Always throws.
   *
   * A duration carrying calendar units has no single numeric value, so `<` and
   * `>` between two of them would compare something meaningless. `compare` and
   * `total` are the operations that actually answer the question.
   */
  valueOf(): never {
    throw new TypeError(
      'A Duration has no numeric value. Use compare() to order two durations, ' +
        'or total(unit) to measure one.',
    );
  }
}

export { Duration };
