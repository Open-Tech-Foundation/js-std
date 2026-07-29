import type { DateTimeUnit, DurationLike } from './types';
import { MS } from './units';

/**
 * A deterministic token formatter for durations.
 *
 * Locale-independent throughout — there are no names to localise — so a pattern
 * produces the same bytes on every runtime and under every ambient locale,
 * which is what makes it safe for log lines, filenames and stopwatch readouts.
 *
 * Longest token first within each letter group, so `mm` is never matched as `m`
 * twice. Text inside single quotes is literal, and `''` is a literal quote.
 */
const TOKENS = /'([^']*)'|yy|y|MM|M|ww|w|dd|d|HH|H|mm|m|ss|s|SSS/g;

/** Which exact unit each token reads, so the pattern can pick the ceiling. */
const TOKEN_UNIT: Record<string, DateTimeUnit> = {
  HH: 'hour',
  H: 'hour',
  mm: 'minute',
  m: 'minute',
  ss: 'second',
  s: 'second',
  SSS: 'millisecond',
};

const EXACT_ORDER: DateTimeUnit[] = ['hour', 'minute', 'second', 'millisecond'];

function pad(value: number, width: number): string {
  return String(Math.abs(value)).padStart(width, '0');
}

/**
 * Splits the exact part across the units the pattern actually asks for.
 *
 * The coarsest exact token in the pattern is the ceiling: `'m:ss'` on ninety
 * minutes reads `90:00` rather than losing the hour, while `'H:mm:ss'` on the
 * same value reads `1:30:00`. Without this a pattern would print whatever the
 * fields happened to be stored as, and `PT90S` would come out as `0:00:90`.
 */
function spread(
  exactMs: number,
  ceiling: DateTimeUnit,
): Record<DateTimeUnit, number> {
  const out = { hour: 0, minute: 0, second: 0, millisecond: 0 } as Record<
    DateTimeUnit,
    number
  >;
  let rest = Math.abs(exactMs);
  let started = false;

  for (const unit of EXACT_ORDER) {
    if (unit === ceiling) {
      started = true;
    }

    if (!started) {
      continue;
    }

    const size = MS[unit];

    out[unit] = Math.trunc(rest / size);
    rest -= out[unit] * size;
  }

  return out;
}

/**
 * Renders duration fields against a pattern.
 *
 * Calendar fields are used as stored, since nothing can rebalance them without
 * a reference point. A negative duration is prefixed with `-` and its
 * components rendered as magnitudes, so the sign appears once.
 *
 * @param {Required<DurationLike>} fields The duration fields.
 * @param {number} sign `-1`, `0` or `1`.
 * @param {string} pattern The token pattern.
 * @returns {string} The formatted duration.
 */
export default function durationTokens(
  fields: Required<DurationLike>,
  sign: -1 | 0 | 1,
  pattern: string,
): string {
  const exactMs =
    fields.hours * MS.hour +
    fields.minutes * MS.minute +
    fields.seconds * MS.second +
    fields.milliseconds;

  // Find the coarsest exact unit the pattern mentions before rendering, so the
  // spread knows where to stop.
  let ceiling: DateTimeUnit = 'millisecond';

  TOKENS.lastIndex = 0;

  for (const match of pattern.matchAll(TOKENS)) {
    // A quoted run is literal text and says nothing about the units wanted.
    if (match[1] !== undefined) {
      continue;
    }

    const unit = TOKEN_UNIT[match[0]];

    if (
      unit !== undefined &&
      EXACT_ORDER.indexOf(unit) < EXACT_ORDER.indexOf(ceiling)
    ) {
      ceiling = unit;
    }
  }

  const exact = spread(exactMs, ceiling);

  TOKENS.lastIndex = 0;

  const body = pattern.replace(TOKENS, (token, quoted?: string) => {
    if (quoted !== undefined) {
      return quoted === '' ? "'" : quoted;
    }

    switch (token) {
      case 'yy':
        return pad(fields.years, 2);
      case 'y':
        return String(Math.abs(fields.years));
      case 'MM':
        return pad(fields.months, 2);
      case 'M':
        return String(Math.abs(fields.months));
      case 'ww':
        return pad(fields.weeks, 2);
      case 'w':
        return String(Math.abs(fields.weeks));
      case 'dd':
        return pad(fields.days, 2);
      case 'd':
        return String(Math.abs(fields.days));
      case 'HH':
        return pad(exact.hour, 2);
      case 'H':
        return String(exact.hour);
      case 'mm':
        return pad(exact.minute, 2);
      case 'm':
        return String(exact.minute);
      case 'ss':
        return pad(exact.second, 2);
      case 's':
        return String(exact.second);
      default:
        return pad(exact.millisecond, 3);
    }
  });

  return sign < 0 ? `-${body}` : body;
}
