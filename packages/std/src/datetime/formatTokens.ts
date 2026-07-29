import { dayOfYear, isoWeek, utcFromParts } from './civil';
import type { CivilFields } from './types';

/**
 * A deterministic token formatter.
 *
 * Everything except month and weekday names is locale-independent, so a pattern
 * produces the same bytes on every runtime and under every ambient locale —
 * which is what makes it safe for filenames, log lines and database columns.
 * Names alone are delegated to `Intl`.
 */

// Longest token first within each letter group, so `MMMM` is never matched as
// `MM` followed by `MM`.
const TOKENS =
  /'([^']*)'|yyyy|yy|MMMM|MMM|MM|M|dd|d|EEEE|EEE|DDD|ww|HH|H|hh|h|mm|m|ss|s|SSS|a|ZZ|Z|zzz/g;

const NAME_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function nameFormatter(
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${locale ?? ''}|${JSON.stringify(options)}`;
  let formatter = NAME_FORMATTERS.get(key);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      ...options,
      timeZone: 'UTC',
    });

    NAME_FORMATTERS.set(key, formatter);
  }

  return formatter;
}

function nameOf(
  civil: CivilFields,
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions,
): string {
  // Midday avoids any chance of a name being pulled across a date boundary.
  const utc = new Date(
    utcFromParts(civil.year, civil.month, civil.day, 12, 0, 0, 0),
  );

  return nameFormatter(locale, options).format(utc);
}

function pad(value: number, width: number): string {
  return String(Math.abs(value)).padStart(width, '0');
}

function formatOffset(offsetMs: number, separator: string): string {
  const sign = offsetMs < 0 ? '-' : '+';
  const total = Math.abs(offsetMs) / 60_000;
  const hours = Math.floor(total / 60);
  const minutes = Math.round(total % 60);

  return `${sign}${pad(hours, 2)}${separator}${pad(minutes, 2)}`;
}

/**
 * Renders a civil reading against a pattern.
 *
 * Text inside single quotes is emitted literally; `''` yields one quote.
 */
export default function formatTokens(
  pattern: string,
  civil: CivilFields,
  timeZone: string,
  locale?: string,
): string {
  return pattern.replace(TOKENS, (token, quoted?: string) => {
    if (quoted !== undefined) {
      return quoted === '' ? "'" : quoted;
    }

    switch (token) {
      case 'yyyy':
        return civil.year < 0 ? `-${pad(civil.year, 4)}` : pad(civil.year, 4);
      case 'yy':
        return pad(civil.year % 100, 2);
      case 'MMMM':
        return nameOf(civil, locale, { month: 'long' });
      case 'MMM':
        return nameOf(civil, locale, { month: 'short' });
      case 'MM':
        return pad(civil.month, 2);
      case 'M':
        return String(civil.month);
      case 'dd':
        return pad(civil.day, 2);
      case 'd':
        return String(civil.day);
      case 'EEEE':
        return nameOf(civil, locale, { weekday: 'long' });
      case 'EEE':
        return nameOf(civil, locale, { weekday: 'short' });
      case 'DDD':
        return String(dayOfYear(civil.year, civil.month, civil.day));
      case 'ww':
        return pad(isoWeek(civil.year, civil.month, civil.day).week, 2);
      case 'HH':
        return pad(civil.hour, 2);
      case 'H':
        return String(civil.hour);
      case 'hh':
        return pad(civil.hour % 12 || 12, 2);
      case 'h':
        return String(civil.hour % 12 || 12);
      case 'mm':
        return pad(civil.minute, 2);
      case 'm':
        return String(civil.minute);
      case 'ss':
        return pad(civil.second, 2);
      case 's':
        return String(civil.second);
      case 'SSS':
        return pad(civil.millisecond, 3);
      case 'a':
        return civil.hour < 12 ? 'AM' : 'PM';
      case 'ZZ':
        return formatOffset(civil.offsetMs, ':');
      case 'Z':
        return formatOffset(civil.offsetMs, '');
      case 'zzz':
        return timeZone;
      default:
        return token;
    }
  });
}
