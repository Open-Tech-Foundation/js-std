import type { DateTimeFields } from './types';

/**
 * ISO-8601, plus Temporal's `[Area/Location]` zone suffix.
 *
 * Deliberately strict. `Date.parse` accepts whatever each engine feels like
 * outside the ISO subset — `Date.parse('2026-13-45')` and `Date.parse('July')`
 * disagree across runtimes — so anything not matching here is rejected rather
 * than guessed at.
 */
const ISO =
  /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?)?(Z|[+-]\d{2}:?\d{2})?(?:\[([^\]]+)\])?$/;

export interface ParsedISO {
  fields: Required<DateTimeFields>;
  /** Offset in milliseconds, or `null` when the string carried none. */
  offsetMs: number | null;
  /** IANA zone from a `[...]` suffix, or `null`. */
  zoneId: string | null;
}

function parseOffset(token: string): number {
  if (token === 'Z') {
    return 0;
  }

  const sign = token[0] === '-' ? -1 : 1;
  const digits = token.slice(1).replace(':', '');
  const hours = Number.parseInt(digits.slice(0, 2), 10);
  const minutes = Number.parseInt(digits.slice(2, 4), 10);

  if (hours > 23 || minutes > 59) {
    throw new RangeError(`Invalid UTC offset: ${token}`);
  }

  return sign * (hours * 60 + minutes) * 60_000;
}

/**
 * Parses an ISO-8601 date or date-time.
 *
 * @throws {RangeError} When the string is malformed or a field is out of range.
 */
export default function parseISO(input: string): ParsedISO {
  const match = ISO.exec(input.trim());

  if (!match) {
    throw new RangeError(`Invalid ISO 8601 date-time string: ${input}`);
  }

  const [, year, month, day, hour, minute, second, fraction, offset, zoneId] =
    match;

  const fields: Required<DateTimeFields> = {
    year: Number.parseInt(year, 10),
    month: Number.parseInt(month, 10),
    day: Number.parseInt(day, 10),
    hour: hour ? Number.parseInt(hour, 10) : 0,
    minute: minute ? Number.parseInt(minute, 10) : 0,
    second: second ? Number.parseInt(second, 10) : 0,
    // Sub-millisecond digits are accepted for compatibility but truncated:
    // `DateTime` resolves to milliseconds.
    millisecond: fraction
      ? Number.parseInt(fraction.padEnd(3, '0').slice(0, 3), 10)
      : 0,
  };

  assertRange(fields, input);

  return {
    fields,
    offsetMs: offset ? parseOffset(offset) : null,
    zoneId: zoneId ?? null,
  };
}

function assertRange(fields: Required<DateTimeFields>, input: string): void {
  const { month, day, hour, minute, second } = fields;

  if (month < 1 || month > 12) {
    throw new RangeError(`Month out of range in: ${input}`);
  }

  if (day < 1 || day > 31) {
    throw new RangeError(`Day out of range in: ${input}`);
  }

  // 24:00 is a valid ISO end-of-day marker; the caller normalises it.
  if (hour > 24 || minute > 59 || second > 59) {
    throw new RangeError(`Time out of range in: ${input}`);
  }
}
