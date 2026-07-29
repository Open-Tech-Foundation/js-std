import {
  assertTimeZone,
  civilBackend,
  dayOfYear,
  daysInMonth,
  fromCivil,
  isLeapYear,
  isoWeek,
  setCivilBackend,
  toCivil,
  utcFromParts,
} from './civil';
import formatTokens from './formatTokens';
import { getTemporal, hasTemporal } from './hasTemporal';
import parseISO from './parseISO';
import type {
  CivilFields,
  DateTimeFields,
  DateTimeOptions,
  DateTimeUnit,
  DurationLike,
} from './types';

const MS: Record<string, number> = {
  hour: 3_600_000,
  minute: 60_000,
  second: 1000,
  millisecond: 1,
};

const PLURAL: Record<DateTimeUnit, keyof DurationLike> = {
  year: 'years',
  month: 'months',
  week: 'weeks',
  day: 'days',
  hour: 'hours',
  minute: 'minutes',
  second: 'seconds',
  millisecond: 'milliseconds',
};

const UNITS = Object.keys(PLURAL) as DateTimeUnit[];

function assertUnit(unit: DateTimeUnit): void {
  if (!UNITS.includes(unit)) {
    throw new RangeError(
      `The unit must be one of ${UNITS.join(', ')}. Received: ${unit}`,
    );
  }
}

/**
 * Normalises a wall-clock reading by round-tripping it through a UTC instant,
 * which rolls over any out-of-range component — notably the ISO `24:00`
 * end-of-day marker, and the day overflow that day arithmetic produces.
 */
function normalize(fields: Required<DateTimeFields>): Required<DateTimeFields> {
  const date = new Date(
    utcFromParts(
      fields.year,
      fields.month,
      fields.day,
      fields.hour,
      fields.minute,
      fields.second,
      fields.millisecond,
    ),
  );

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
    millisecond: date.getUTCMilliseconds(),
  };
}

const RANGES: Array<[keyof DateTimeFields, number, number]> = [
  ['month', 1, 12],
  ['day', 1, 31],
  ['hour', 0, 24],
  ['minute', 0, 59],
  ['second', 0, 59],
  ['millisecond', 0, 999],
];

/**
 * Validates user-supplied fields and clamps the day to the length of its month,
 * so 31 January with a month set to February lands on the 28th or 29th rather
 * than rolling into March.
 */
function resolveFields(input: DateTimeFields): Required<DateTimeFields> {
  for (const key of ['year', 'month', 'day'] as const) {
    if (input[key] === undefined) {
      throw new RangeError(`A fields object requires ${key}.`);
    }
  }

  if (!Number.isInteger(input.year)) {
    throw new RangeError('The year must be an integer.');
  }

  for (const [key, min, max] of RANGES) {
    const value = input[key];

    if (value === undefined) {
      continue;
    }

    if (!Number.isInteger(value) || value < min || value > max) {
      throw new RangeError(
        `The ${key} must be an integer between ${min} and ${max}. Received: ${value}`,
      );
    }
  }

  const year = input.year;
  const month = input.month;

  return normalize({
    year,
    month,
    day: Math.min(input.day, daysInMonth(year, month)),
    hour: input.hour ?? 0,
    minute: input.minute ?? 0,
    second: input.second ?? 0,
    millisecond: input.millisecond ?? 0,
  });
}

/**
 * An immutable date and time in an IANA time zone.
 *
 * Backed by the TC39 Temporal API where the runtime provides it, and by
 * `Intl.DateTimeFormat` everywhere else. Both paths implement the same
 * semantics, so behaviour does not change with the host — only the machinery
 * underneath does.
 *
 * Every method returns a new instance; nothing mutates. Months and days are
 * 1-based and `dayOfWeek` runs 1 (Monday) to 7 (Sunday), matching Temporal and
 * ISO-8601 rather than the legacy `Date`.
 *
 * @example
 * const dt = new DateTime('2026-03-08T01:30:00', {
 *   timeZone: 'America/New_York',
 * });
 *
 * dt.format('yyyy-MM-dd HH:mm ZZ');        //=> '2026-03-08 01:30 -05:00'
 * dt.add({ hours: 1 }).format('HH:mm ZZ'); //=> '03:00 -04:00'  (gap skipped)
 * dt.add({ days: 1 }).format('HH:mm ZZ');  //=> '01:30 -04:00'  (clock kept)
 */
export default class DateTime {
  private readonly ms: number;
  private readonly zone: string;
  private readonly fields: CivilFields;

  /**
   * @param input An ISO-8601 string, epoch milliseconds, a `Date`, another
   *   `DateTime`, or a wall-clock fields object. Omit it for the current time.
   * @param options `timeZone` defaults to `'UTC'`; `disambiguation` controls
   *   how a DST gap or overlap is resolved and defaults to `'compatible'`.
   *
   * @throws {RangeError} On an unparseable string, an out-of-range field or an
   *   unknown time zone.
   * @throws {TypeError} On an unsupported input type.
   */
  constructor(
    input?: string | number | Date | DateTime | DateTimeFields,
    options: DateTimeOptions = {},
  ) {
    const disambiguation = options.disambiguation ?? 'compatible';
    let zone = options.timeZone;
    let epochMs: number;

    if (input === undefined) {
      epochMs = Date.now();
    } else if (typeof input === 'number') {
      if (!Number.isFinite(input)) {
        throw new RangeError(
          `The epoch milliseconds must be a finite number. Received: ${input}`,
        );
      }

      epochMs = Math.trunc(input);
    } else if (input instanceof Date) {
      epochMs = input.getTime();

      if (Number.isNaN(epochMs)) {
        throw new RangeError('The Date is invalid.');
      }
    } else if (input instanceof DateTime) {
      epochMs = input.ms;
      zone = zone ?? input.zone;
    } else if (typeof input === 'string') {
      const parsed = parseISO(input);

      zone = zone ?? parsed.zoneId ?? 'UTC';
      assertTimeZone(zone);

      if (parsed.offsetMs !== null) {
        // An explicit offset fixes the instant outright, so no zone rules apply.
        const fields = normalize(parsed.fields);

        epochMs =
          utcFromParts(
            fields.year,
            fields.month,
            fields.day,
            fields.hour,
            fields.minute,
            fields.second,
            fields.millisecond,
          ) - parsed.offsetMs;
      } else {
        epochMs = fromCivil(
          normalize(parsed.fields),
          parsed.zoneId ?? zone,
          disambiguation,
        );
      }
    } else if (typeof input === 'object' && input !== null) {
      zone = zone ?? 'UTC';
      assertTimeZone(zone);

      epochMs = fromCivil(resolveFields(input), zone, disambiguation);
    } else {
      throw new TypeError(
        'The input must be a string, number, Date, DateTime or fields object.',
      );
    }

    this.zone = zone ?? 'UTC';
    assertTimeZone(this.zone);

    this.ms = epochMs;
    this.fields = toCivil(epochMs, this.zone);

    Object.freeze(this);
  }

  /** The current time, in `timeZone` or UTC. */
  static now(timeZone?: string): DateTime {
    return new DateTime(Date.now(), { timeZone });
  }

  /** Orders two instances. Suitable as an `Array.prototype.sort` comparator. */
  static compare(a: DateTime, b: DateTime): -1 | 0 | 1 {
    return a.compare(b);
  }

  /** Whether this runtime provides Temporal, and so the Temporal backend. */
  static get hasTemporal(): boolean {
    return hasTemporal();
  }

  /**
   * Pins the civil backend, or restores automatic selection with `null`.
   *
   * @internal Test-only, so the suite can run the same assertions against both
   *   backends and assert they agree. It has to hang off the class rather than
   *   live in a module the specs import directly: the cross-runtime harness
   *   rewrites only the package barrel to `dist`, so a deep import would load a
   *   second copy of the module and the switch would silently do nothing.
   */
  static _setBackend(backend: 'temporal' | 'intl' | null): void {
    setCivilBackend(backend);
  }

  /** @internal Test-only. The backend currently in use. */
  static _backend(): 'temporal' | 'intl' {
    return civilBackend();
  }

  /**
   * Converts from a `Temporal.ZonedDateTime` or `Temporal.Instant`.
   *
   * @throws {Error} On a runtime without Temporal.
   */
  static fromTemporal(value: {
    epochMilliseconds: number;
    timeZoneId?: string;
    timeZone?: unknown;
  }): DateTime {
    getTemporal();

    if (typeof value?.epochMilliseconds !== 'number') {
      throw new TypeError(
        'The value must be a Temporal.ZonedDateTime or Temporal.Instant.',
      );
    }

    // Older revisions of the proposal — still what Node.js 24/25 ship behind
    // `--harmony-temporal` — expose the zone as a `timeZone` object rather than
    // a `timeZoneId` string. Reading only `timeZoneId` there would silently
    // drop the zone and fall back to UTC. A `Temporal.Instant` has neither.
    const zone =
      value.timeZoneId ??
      (value.timeZone === undefined || value.timeZone === null
        ? undefined
        : String(value.timeZone));

    return new DateTime(value.epochMilliseconds, {
      timeZone: zone ?? 'UTC',
    });
  }

  get year(): number {
    return this.fields.year;
  }

  /** The month, 1 (January) to 12 (December). */
  get month(): number {
    return this.fields.month;
  }

  get day(): number {
    return this.fields.day;
  }

  get hour(): number {
    return this.fields.hour;
  }

  get minute(): number {
    return this.fields.minute;
  }

  get second(): number {
    return this.fields.second;
  }

  get millisecond(): number {
    return this.fields.millisecond;
  }

  /** 1 (Monday) to 7 (Sunday), per ISO-8601. */
  get dayOfWeek(): number {
    return this.fields.dayOfWeek;
  }

  /** The 1-based ordinal within the year, 1 to 366. */
  get dayOfYear(): number {
    return dayOfYear(this.fields.year, this.fields.month, this.fields.day);
  }

  /** The ISO-8601 week number, 1 to 53. */
  get weekOfYear(): number {
    return isoWeek(this.fields.year, this.fields.month, this.fields.day).week;
  }

  /**
   * The ISO-8601 week-numbering year, which can differ from `year` at the
   * boundaries: 2027-01-01 falls in week 53 of week-year 2026.
   */
  get weekYear(): number {
    return isoWeek(this.fields.year, this.fields.month, this.fields.day)
      .weekYear;
  }

  get daysInMonth(): number {
    return daysInMonth(this.fields.year, this.fields.month);
  }

  get daysInYear(): number {
    return isLeapYear(this.fields.year) ? 366 : 365;
  }

  get inLeapYear(): boolean {
    return isLeapYear(this.fields.year);
  }

  /** The IANA time zone id. */
  get timeZone(): string {
    return this.zone;
  }

  /** The UTC offset in force at this instant, as `'+05:30'`. */
  get offset(): string {
    const sign = this.fields.offsetMs < 0 ? '-' : '+';
    const total = Math.abs(this.fields.offsetMs) / 60_000;
    const hours = String(Math.floor(total / 60)).padStart(2, '0');
    const minutes = String(Math.round(total % 60)).padStart(2, '0');

    return `${sign}${hours}:${minutes}`;
  }

  /** The UTC offset in force at this instant, in milliseconds. */
  get offsetMs(): number {
    return this.fields.offsetMs;
  }

  get epochMs(): number {
    return this.ms;
  }

  /**
   * Adds a duration.
   *
   * Calendar units (`years`, `months`, `weeks`, `days`) move the wall clock:
   * adding a day across a DST boundary keeps the same local time and so may
   * advance 23 or 25 real hours. Exact units (`hours` and below) move the
   * instant and always advance exactly as much as asked. Month arithmetic
   * clamps, so 31 January plus one month is 28 or 29 February.
   *
   * When both kinds are present the calendar units apply first.
   */
  add(duration: DurationLike): DateTime {
    const {
      years = 0,
      months = 0,
      weeks = 0,
      days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
      milliseconds = 0,
    } = duration;

    for (const [name, value] of Object.entries({
      years,
      months,
      weeks,
      days,
    })) {
      if (!Number.isInteger(value)) {
        throw new RangeError(`The ${name} must be an integer.`);
      }
    }

    let epochMs = this.ms;

    if (years || months || weeks || days) {
      const civil = this.fields;
      const total = civil.year * 12 + (civil.month - 1) + years * 12 + months;

      let year = Math.floor(total / 12);
      let month = total - year * 12 + 1;
      let day = Math.min(civil.day, daysInMonth(year, month));

      if (weeks || days) {
        const shifted =
          utcFromParts(year, month, day) + (weeks * 7 + days) * 86_400_000;
        const date = new Date(shifted);

        year = date.getUTCFullYear();
        month = date.getUTCMonth() + 1;
        day = date.getUTCDate();
      }

      epochMs = fromCivil(
        {
          year,
          month,
          day,
          hour: civil.hour,
          minute: civil.minute,
          second: civil.second,
          millisecond: civil.millisecond,
        },
        this.zone,
        'compatible',
      );
    }

    epochMs +=
      hours * MS.hour +
      minutes * MS.minute +
      seconds * MS.second +
      milliseconds;

    return new DateTime(epochMs, { timeZone: this.zone });
  }

  /** Subtracts a duration. Equivalent to `add` with every value negated. */
  subtract(duration: DurationLike): DateTime {
    const negated: DurationLike = {};

    for (const [key, value] of Object.entries(duration)) {
      negated[key as keyof DurationLike] = -(value as number);
    }

    return this.add(negated);
  }

  /**
   * Replaces wall-clock fields, keeping the time zone.
   *
   * The day clamps to the length of the resulting month.
   */
  with(fields: Partial<DateTimeFields>): DateTime {
    return new DateTime(
      {
        year: fields.year ?? this.fields.year,
        month: fields.month ?? this.fields.month,
        day: fields.day ?? this.fields.day,
        hour: fields.hour ?? this.fields.hour,
        minute: fields.minute ?? this.fields.minute,
        second: fields.second ?? this.fields.second,
        millisecond: fields.millisecond ?? this.fields.millisecond,
      },
      { timeZone: this.zone },
    );
  }

  /**
   * Reinterprets the same instant in another zone. The wall clock changes; the
   * moment in time does not. Use `with` for the opposite.
   */
  withTimeZone(timeZone: string): DateTime {
    return new DateTime(this.ms, { timeZone });
  }

  /** Truncates to the start of a unit. Weeks start on Monday. */
  startOf(unit: DateTimeUnit): DateTime {
    assertUnit(unit);

    const civil = this.fields;
    const fields: Required<DateTimeFields> = {
      year: civil.year,
      month: civil.month,
      day: civil.day,
      hour: civil.hour,
      minute: civil.minute,
      second: civil.second,
      millisecond: civil.millisecond,
    };

    switch (unit) {
      case 'millisecond':
        return this;
      case 'year':
        fields.month = 1;
        fields.day = 1;
        break;
      case 'month':
        fields.day = 1;
        break;
      case 'week': {
        const start =
          utcFromParts(civil.year, civil.month, civil.day) -
          (civil.dayOfWeek - 1) * 86_400_000;
        const date = new Date(start);

        fields.year = date.getUTCFullYear();
        fields.month = date.getUTCMonth() + 1;
        fields.day = date.getUTCDate();
        break;
      }
    }

    if (unit !== 'hour' && unit !== 'minute' && unit !== 'second') {
      fields.hour = 0;
    }

    if (unit !== 'minute' && unit !== 'second') {
      fields.minute = 0;
    }

    if (unit !== 'second') {
      fields.second = 0;
    }

    fields.millisecond = 0;

    return new DateTime(fields, { timeZone: this.zone });
  }

  /**
   * The last representable millisecond of a unit, so `endOf('day')` is
   * `23:59:59.999` rather than the following midnight.
   */
  endOf(unit: DateTimeUnit): DateTime {
    assertUnit(unit);

    if (unit === 'millisecond') {
      return this;
    }

    const next = this.startOf(unit).add({ [PLURAL[unit]]: 1 });

    return new DateTime(next.ms - 1, { timeZone: this.zone });
  }

  /**
   * The signed difference `this − other`, expressed in `unit`.
   *
   * Calendar units (`year`, `month`, `week`, `day`) count whole units,
   * truncated toward zero and aware of month lengths and DST: 31 January to 31
   * March is exactly 2 months. Exact units (`hour` and below) return elapsed
   * real time and may be fractional.
   */
  diff(other: DateTime, unit: DateTimeUnit): number {
    assertUnit(unit);

    if (!(other instanceof DateTime)) {
      throw new TypeError('The other value must be a DateTime.');
    }

    const exact = MS[unit];

    if (exact !== undefined) {
      return (this.ms - other.ms) / exact;
    }

    return this.wholeDiff(other, unit);
  }

  private wholeDiff(other: DateTime, unit: DateTimeUnit): number {
    if (this.ms === other.ms) {
      return 0;
    }

    const sign = this.ms > other.ms ? 1 : -1;
    const reach = (count: number) => other.add({ [PLURAL[unit]]: count }).ms;

    let n = this.estimate(other, unit);

    if (n * sign < 0) {
      n = 0;
    }

    // The estimate ignores time of day and month lengths, so correct it: pull
    // back while it overshoots, then push out while another whole unit fits.
    while (n !== 0 && sign * (reach(n) - this.ms) > 0) {
      n -= sign;
    }

    while (sign * (reach(n + sign) - this.ms) <= 0) {
      n += sign;
    }

    return n;
  }

  private estimate(other: DateTime, unit: DateTimeUnit): number {
    const a = this.fields;
    const b = other.fields;

    if (unit === 'year') {
      return a.year - b.year;
    }

    if (unit === 'month') {
      return (a.year - b.year) * 12 + (a.month - b.month);
    }

    const days = Math.round(
      (utcFromParts(a.year, a.month, a.day) -
        utcFromParts(b.year, b.month, b.day)) /
        86_400_000,
    );

    return unit === 'week' ? Math.trunc(days / 7) : days;
  }

  /** Orders by instant, ignoring time zone. */
  compare(other: DateTime): -1 | 0 | 1 {
    if (!(other instanceof DateTime)) {
      throw new TypeError('The other value must be a DateTime.');
    }

    if (this.ms === other.ms) {
      return 0;
    }

    return this.ms < other.ms ? -1 : 1;
  }

  /**
   * Whether both the instant **and** the time zone match. For instant-only
   * equality across zones use `compare(other) === 0`.
   */
  equals(other: DateTime): boolean {
    return (
      other instanceof DateTime &&
      this.ms === other.ms &&
      this.zone === other.zone
    );
  }

  isBefore(other: DateTime): boolean {
    return this.compare(other) === -1;
  }

  isAfter(other: DateTime): boolean {
    return this.compare(other) === 1;
  }

  /** Inclusive of both bounds, whichever order they are given in. */
  isBetween(start: DateTime, end: DateTime): boolean {
    const from = Math.min(start.ms, end.ms);
    const to = Math.max(start.ms, end.ms);

    return this.ms >= from && this.ms <= to;
  }

  /**
   * Renders against a token pattern. Text in single quotes is literal.
   *
   * | | | | |
   * |---|---|---|---|
   * | `yyyy` `yy` | year | `HH` `H` | hour, 0–23 |
   * | `MMMM` `MMM` `MM` `M` | month | `hh` `h` | hour, 1–12 |
   * | `dd` `d` | day | `mm` `m` | minute |
   * | `EEEE` `EEE` | weekday | `ss` `s` | second |
   * | `DDD` | day of year | `SSS` | millisecond |
   * | `ww` | ISO week | `a` | AM/PM |
   * | `zzz` | zone id | `ZZ` `Z` | offset |
   *
   * Only month and weekday names depend on `locale`; everything else is
   * locale-independent, so patterns are safe for filenames and log lines.
   */
  format(pattern: string, locale?: string): string {
    if (typeof pattern !== 'string') {
      throw new TypeError('The pattern must be a string.');
    }

    return formatTokens(pattern, this.fields, this.zone, locale);
  }

  /** Localised output, delegated to `Intl.DateTimeFormat`. */
  toLocaleString(
    locale?: string,
    options: Intl.DateTimeFormatOptions = {},
  ): string {
    // Any explicit component request replaces the defaults, since Intl throws
    // when dateStyle/timeStyle are mixed with individual components.
    const requested = Object.keys(options).some(
      (key) => key !== 'timeZone' && key !== 'hour12' && key !== 'hourCycle',
    );

    return new Intl.DateTimeFormat(locale, {
      ...(requested ? {} : { dateStyle: 'medium', timeStyle: 'medium' }),
      ...options,
      timeZone: options.timeZone ?? this.zone,
    }).format(new Date(this.ms));
  }

  /**
   * The full ISO-8601 form, including the offset and a Temporal-style zone
   * suffix: `2026-07-29T14:30:15.250+05:30[Asia/Kolkata]`. Round-trips through
   * the constructor exactly.
   */
  toISOString(): string {
    const { year } = this.fields;
    const rest = this.format("MM-dd'T'HH:mm:ss.SSSZZ");
    const prefix =
      year < 0 || year > 9999
        ? `${year < 0 ? '-' : '+'}${String(Math.abs(year)).padStart(6, '0')}`
        : String(year).padStart(4, '0');

    return `${prefix}-${rest}[${this.zone}]`;
  }

  /** A `Date` at the same instant. Time zone and sub-millisecond data are lost. */
  toDate(): Date {
    return new Date(this.ms);
  }

  /** Makes `JSON.stringify` emit the round-trippable ISO form. */
  toJSON(): string {
    return this.toISOString();
  }

  toString(): string {
    return this.toISOString();
  }

  /** The epoch milliseconds, so `<` and `>` order instances directly. */
  valueOf(): number {
    return this.ms;
  }

  /**
   * Converts to a `Temporal.ZonedDateTime` at the same instant and zone.
   *
   * @throws {Error} On a runtime without Temporal.
   */
  toTemporal(): unknown {
    const instant = getTemporal().Instant.fromEpochMilliseconds(this.ms) as {
      toZonedDateTimeISO(timeZone: string): unknown;
    };

    return instant.toZonedDateTimeISO(this.zone);
  }
}
