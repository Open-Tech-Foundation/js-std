import type { DateTimeUnit, DurationLike } from './types';
import { PLURAL, UNITS } from './units';

/**
 * `Intl.DurationFormat` and `Intl.RelativeTimeFormat`, where the runtime has
 * them, with an English fallback where it does not.
 *
 * `Intl.RelativeTimeFormat` is old enough to be everywhere that matters, but
 * `Intl.DurationFormat` is recent — absent on Bun, on LLRT and on Node.js
 * before 23 — so neither can be assumed. The fallback approximates the `short`
 * style `Intl.DurationFormat` uses by default, so output stays recognisably the
 * same shape across runtimes even though only the Intl path is localised.
 */

interface DurationFormatter {
  format(input: DurationLike): string;
}

interface RelativeFormatter {
  format(value: number, unit: string): string;
}

interface IntlWithDuration {
  DurationFormat?: new (
    locale?: string | string[],
    options?: unknown,
  ) => DurationFormatter;
  RelativeTimeFormat?: new (
    locale?: string | string[],
    options?: unknown,
  ) => RelativeFormatter;
}

function intl(): IntlWithDuration {
  return (globalThis.Intl ?? {}) as IntlWithDuration;
}

const DURATION_CACHE = new Map<string, DurationFormatter>();
const RELATIVE_CACHE = new Map<string, RelativeFormatter>();

function key(locale: string | undefined, options: unknown): string {
  return `${locale ?? ''}|${JSON.stringify(options ?? {})}`;
}

/** Whether this runtime provides `Intl.DurationFormat`. */
export function hasDurationFormat(): boolean {
  return typeof intl().DurationFormat === 'function';
}

/** Whether this runtime provides `Intl.RelativeTimeFormat`. */
export function hasRelativeTimeFormat(): boolean {
  return typeof intl().RelativeTimeFormat === 'function';
}

export function durationFormatter(
  locale: string | undefined,
  options: unknown,
): DurationFormatter | null {
  const Ctor = intl().DurationFormat;

  if (typeof Ctor !== 'function') {
    return null;
  }

  const id = key(locale, options);
  let formatter = DURATION_CACHE.get(id);

  if (!formatter) {
    formatter = new Ctor(locale, options);
    DURATION_CACHE.set(id, formatter);
  }

  return formatter;
}

export function relativeFormatter(
  locale: string | undefined,
  options: unknown,
): RelativeFormatter | null {
  const Ctor = intl().RelativeTimeFormat;

  if (typeof Ctor !== 'function') {
    return null;
  }

  const id = key(locale, options);
  let formatter = RELATIVE_CACHE.get(id);

  if (!formatter) {
    formatter = new Ctor(locale, options);
    RELATIVE_CACHE.set(id, formatter);
  }

  return formatter;
}

/** Singular and plural short names, following the `en` `short` style. */
const SHORT: Record<DateTimeUnit, [string, string]> = {
  year: ['yr', 'yrs'],
  month: ['mth', 'mths'],
  week: ['wk', 'wks'],
  day: ['day', 'days'],
  hour: ['hr', 'hr'],
  minute: ['min', 'min'],
  second: ['sec', 'sec'],
  millisecond: ['ms', 'ms'],
};

const LONG: Record<DateTimeUnit, string> = {
  year: 'year',
  month: 'month',
  week: 'week',
  day: 'day',
  hour: 'hour',
  minute: 'minute',
  second: 'second',
  millisecond: 'millisecond',
};

/** The English stand-in for `Intl.DurationFormat`. Zero fields are omitted. */
export function englishDuration(fields: Required<DurationLike>): string {
  const parts: string[] = [];

  for (const unit of UNITS) {
    const value = fields[PLURAL[unit]] as number;

    if (value !== 0) {
      const [one, many] = SHORT[unit];

      parts.push(`${value} ${Math.abs(value) === 1 ? one : many}`);
    }
  }

  return parts.length === 0 ? `0 ${SHORT.second[0]}` : parts.join(', ');
}

/** The English stand-in for `Intl.RelativeTimeFormat`, in its `always` style. */
export function englishRelative(value: number, unit: DateTimeUnit): string {
  const name = `${LONG[unit]}${Math.abs(value) === 1 ? '' : 's'}`;

  return value < 0 ? `${Math.abs(value)} ${name} ago` : `in ${value} ${name}`;
}
