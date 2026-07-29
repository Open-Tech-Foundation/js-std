import { getTemporal, hasTemporal } from './hasTemporal';
import type { CivilFields, DateTimeFields, Disambiguation } from './types';

/**
 * Conversion between an instant (epoch milliseconds) and a wall-clock reading
 * in an IANA time zone, in both directions.
 *
 * Two interchangeable backends implement it:
 *
 * - **Temporal** — used when the runtime provides it. Exact by construction.
 * - **Intl** — used everywhere else. `Intl.DateTimeFormat` with a `timeZone`
 *   and `formatToParts` is available on every runtime this package targets
 *   (verified on Node.js, Bun, Deno, ES-Runtime and LLRT), and yields correct
 *   civil fields for any zone with no bundled time-zone database.
 *
 * Both must agree. `setCivilBackend` exists so the suite can pin one and run
 * the same assertions against the other.
 */

type Backend = 'temporal' | 'intl';

let forced: Backend | null = null;

/**
 * Pins the backend, or restores automatic selection with `null`.
 *
 * @internal Test-only. Not exported from the package entry point.
 */
export function setCivilBackend(backend: Backend | null): void {
  forced = backend;
}

/** The backend currently in use. */
export function civilBackend(): Backend {
  if (forced) {
    return forced;
  }

  return hasTemporal() ? 'temporal' : 'intl';
}

/**
 * Builds an epoch timestamp from UTC calendar parts.
 *
 * `Date.UTC` maps years 0–99 into the 1900s, so it cannot express year 50.
 * Assigning through `setUTCFullYear` has no such rule and normalises
 * out-of-range months and days, which day arithmetic relies on.
 */
export function utcFromParts(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0,
): number {
  const date = new Date(0);

  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, millisecond);

  return date.getTime();
}

/** The number of days in a month, with a 1-based `month`. */
export function daysInMonth(year: number, month: number): number {
  // Day 0 of the following month is the last day of this one.
  return new Date(utcFromParts(year, month + 1, 0)).getUTCDate();
}

/** Whether a year has 366 days, per the proleptic Gregorian calendar. */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const DAY_MS = 86_400_000;

/** The 1-based ordinal of a date within its year. */
export function dayOfYear(year: number, month: number, day: number): number {
  const diff = utcFromParts(year, month, day) - utcFromParts(year, 1, 1);

  return Math.round(diff / DAY_MS) + 1;
}

/**
 * The ISO-8601 week number and its week-numbering year.
 *
 * The two can disagree with the calendar year at the edges: 2027-01-01 belongs
 * to week 53 of week-year 2026.
 */
export function isoWeek(
  year: number,
  month: number,
  day: number,
): { week: number; weekYear: number } {
  const start = utcFromParts(year, month, day);
  const dow = ((new Date(start).getUTCDay() + 6) % 7) + 1;

  // A week belongs to whichever year contains its Thursday.
  const thursday = start + (4 - dow) * DAY_MS;
  const weekYear = new Date(thursday).getUTCFullYear();
  const jan1 = utcFromParts(weekYear, 1, 1);

  return {
    week: Math.floor((thursday - jan1) / (7 * DAY_MS)) + 1,
    weekYear,
  };
}

const FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let formatter = FORMATTERS.get(timeZone);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      era: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });

    FORMATTERS.set(timeZone, formatter);
  }

  return formatter;
}

/**
 * Validates an IANA time zone id.
 *
 * `Intl.supportedValuesOf` would be the direct check but LLRT lacks it, so this
 * relies on `Intl.DateTimeFormat` rejecting an unknown zone instead — behaviour
 * every target runtime shares.
 *
 * @throws {RangeError} When the zone is not recognised.
 */
export function assertTimeZone(timeZone: string): void {
  if (typeof timeZone !== 'string') {
    throw new TypeError('The timeZone must be a string.');
  }

  try {
    formatterFor(timeZone);
  } catch {
    throw new RangeError(`Invalid time zone: ${timeZone}`);
  }
}

function toCivilIntl(epochMs: number, timeZone: string): CivilFields {
  const parts = formatterFor(timeZone).formatToParts(new Date(epochMs));

  let year = 0;
  let month = 1;
  let day = 1;
  let hour = 0;
  let minute = 0;
  let second = 0;
  let isBC = false;

  for (const part of parts) {
    switch (part.type) {
      case 'year':
        year = Number.parseInt(part.value, 10);
        break;
      case 'month':
        month = Number.parseInt(part.value, 10);
        break;
      case 'day':
        day = Number.parseInt(part.value, 10);
        break;
      case 'hour':
        hour = Number.parseInt(part.value, 10);
        break;
      case 'minute':
        minute = Number.parseInt(part.value, 10);
        break;
      case 'second':
        second = Number.parseInt(part.value, 10);
        break;
      case 'era':
        isBC = /^b/i.test(part.value);
        break;
    }
  }

  if (isBC) {
    // Era years count backwards from 1 BC, which is ISO year 0.
    year = 1 - year;
  }

  // `hourCycle: 'h23'` should prevent this, but some engines still report
  // midnight as hour 24 of the same day.
  if (hour === 24) {
    hour = 0;
  }

  // Every IANA offset is a whole number of seconds, so the sub-second part of
  // the instant survives the zone shift untouched and can be read off directly.
  const millisecond = ((epochMs % 1000) + 1000) % 1000;

  const asIfUTC = utcFromParts(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
  );

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    offsetMs: asIfUTC - epochMs,
    dayOfWeek: ((new Date(asIfUTC).getUTCDay() + 6) % 7) + 1,
  };
}

function offsetMsIntl(epochMs: number, timeZone: string): number {
  return toCivilIntl(epochMs, timeZone).offsetMs;
}

function fromCivilIntl(
  fields: Required<DateTimeFields>,
  timeZone: string,
  disambiguation: Disambiguation,
): number {
  // Treat the wall-clock reading as though it were UTC, then subtract the
  // offset actually in force to land on the real instant. The offset depends on
  // the instant we are solving for, so it takes two passes to converge.
  const guess = utcFromParts(
    fields.year,
    fields.month,
    fields.day,
    fields.hour,
    fields.minute,
    fields.second,
    fields.millisecond,
  );

  // Probe a day either side rather than at the wall time itself. Inside a DST
  // overlap both offsets are valid answers, but a probe at the wall time only
  // ever reports one of them, so the second candidate would never be found. No
  // real zone has two transitions within a day of each other.
  const first = offsetMsIntl(guess - DAY_MS, timeZone);
  const second = offsetMsIntl(guess + DAY_MS, timeZone);

  const valid: number[] = [];

  for (const offset of first === second ? [first] : [first, second]) {
    const candidate = guess - offset;

    // Keep only offsets that are self-consistent: the instant they produce must
    // really sit at that offset. Near a transition one of them will not.
    if (offsetMsIntl(candidate, timeZone) === offset) {
      valid.push(candidate);
    }
  }

  if (valid.length === 1) {
    return valid[0];
  }

  if (valid.length > 1) {
    // Overlap: the clock went back, so this wall time happened twice.
    if (disambiguation === 'reject') {
      throw new RangeError(
        'The wall-clock time is ambiguous: it occurs twice in this time zone.',
      );
    }

    return disambiguation === 'later' ? Math.max(...valid) : Math.min(...valid);
  }

  // Gap: the clock jumped forward, so this wall time never happened.
  if (disambiguation === 'reject') {
    throw new RangeError(
      'The wall-clock time does not exist: it falls in a DST gap.',
    );
  }

  // The clock jumps forward, so the pre-transition offset is the smaller of the
  // two, and pairing it with the requested wall time gives the later instant.
  return disambiguation === 'earlier'
    ? guess - Math.max(first, second)
    : guess - Math.min(first, second);
}

function toCivilTemporal(epochMs: number, timeZone: string): CivilFields {
  const zoned = (
    getTemporal().Instant.fromEpochMilliseconds(epochMs) as {
      toZonedDateTimeISO(tz: string): Record<string, number>;
    }
  ).toZonedDateTimeISO(timeZone);

  return {
    year: zoned.year,
    month: zoned.month,
    day: zoned.day,
    hour: zoned.hour,
    minute: zoned.minute,
    second: zoned.second,
    millisecond: zoned.millisecond,
    offsetMs: Number(zoned.offsetNanoseconds) / 1e6,
    dayOfWeek: zoned.dayOfWeek,
  };
}

function fromCivilTemporal(
  fields: Required<DateTimeFields>,
  timeZone: string,
  disambiguation: Disambiguation,
): number {
  const zoned = getTemporal().ZonedDateTime.from(
    { ...fields, timeZone },
    { disambiguation },
  ) as { epochMilliseconds: number };

  return zoned.epochMilliseconds;
}

/** Resolves an instant to a wall-clock reading in a zone. */
export function toCivil(epochMs: number, timeZone: string): CivilFields {
  return civilBackend() === 'temporal'
    ? toCivilTemporal(epochMs, timeZone)
    : toCivilIntl(epochMs, timeZone);
}

/** Resolves a wall-clock reading in a zone back to an instant. */
export function fromCivil(
  fields: Required<DateTimeFields>,
  timeZone: string,
  disambiguation: Disambiguation = 'compatible',
): number {
  return civilBackend() === 'temporal'
    ? fromCivilTemporal(fields, timeZone, disambiguation)
    : fromCivilIntl(fields, timeZone, disambiguation);
}
