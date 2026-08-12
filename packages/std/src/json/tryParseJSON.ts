import DateTime from '../datetime/DateTime';
import Duration from '../datetime/Duration';
import { hasTemporal } from '../datetime/hasTemporal';

export interface TryParseJSONOptions {
  reviver?: (key: string, value: unknown) => unknown;
  temporal?: boolean;
}

/**
 * Safely parses a JSON string without throwing.
 *
 * Returns the parsed value on success, or `fallback` (or `undefined` if no
 * fallback is given) when `text` is not a string or contains invalid JSON.
 * A `reviver` is passed through to `JSON.parse` when provided.
 * ISO 8601 date/time strings are revived to `DateTime` and durations to
 * `Duration` by default (native `Temporal` where available). Pass
 * `temporal:false` to disable.
 *
 * @param text The JSON string to parse. Non-strings immediately return `fallback`.
 * @param fallback Value to return on failure. Defaults to `undefined`.
 * @param reviver Optional `JSON.parse` reviver, or options with `reviver`/`temporal`.
 * @returns The parsed value or the fallback.
 *
 * @example
 * tryParseJSON('{"a":1}') //=> {a:1}
 * tryParseJSON('bad', {a:1}) //=> {a:1}
 * tryParseJSON(123, []) //=> []
 * tryParseJSON('{"a":1}', undefined, (k,v) => k==='a'? (v as number)*2 : v) //=> {a:2}
 * tryParseJSON('{"t":"2024-01-01T00:00:00.000Z"}') //=> {t: DateTime} — temporal by default
 */
export default function tryParseJSON<T>(
  text: unknown,
  fallback?: T,
  reviverOrOptions?:
    | ((key: string, value: unknown) => unknown)
    | TryParseJSONOptions,
): T | undefined {
  if (typeof text !== 'string') return fallback as T | undefined;

  let reviver: ((key: string, value: unknown) => unknown) | undefined;
  let temporal = true;

  if (typeof reviverOrOptions === 'function') {
    reviver = reviverOrOptions;
  } else if (reviverOrOptions != null && typeof reviverOrOptions === 'object') {
    reviver = (reviverOrOptions as TryParseJSONOptions).reviver;
    if ((reviverOrOptions as TryParseJSONOptions).temporal === false)
      temporal = false;
  }

  const finalReviver = temporal ? createTemporalReviver(reviver) : reviver;

  try {
    const result =
      finalReviver === undefined
        ? JSON.parse(text)
        : JSON.parse(
            text,
            finalReviver as (key: string, value: unknown) => unknown,
          );
    return result as T;
  } catch {
    return fallback as T | undefined;
  }
}

function createTemporalReviver(
  userReviver?: (key: string, value: unknown) => unknown,
): (key: string, value: unknown) => unknown {
  return (key: string, value: unknown): unknown => {
    let v: unknown = value;

    if (typeof v === 'string' && isPossibleTemporalString(v)) {
      const revived = tryReviveTemporal(v);
      if (revived !== undefined) v = revived;
    }

    if (userReviver) return userReviver(key, v);
    return v;
  };
}

const ISO_DATETIME_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DURATION_RE = /^P.+$/;

function isPossibleTemporalString(s: string): boolean {
  return (
    ISO_DATETIME_RE.test(s) || ISO_DATE_RE.test(s) || ISO_DURATION_RE.test(s)
  );
}

function tryReviveTemporal(s: string): unknown {
  // Try Duration first — starts with P
  if (s.startsWith('P')) {
    try {
      return new Duration(s);
    } catch {
      // fall through
    }
  }

  // Try DateTime — handles date, datetime, with zone via Intl fallback
  // Use DateTime's ISO parsing (supports Temporal when available)
  try {
    // Quick check: must contain date part
    if (ISO_DATE_RE.test(s) || ISO_DATETIME_RE.test(s)) {
      const dt = new DateTime(s);
      // If DateTime parsed to valid (toISOString not throw), return it
      // Invalid DateTime throws on construction for bad input
      // Additional check: ensure dt is valid by checking toISOString
      dt.toISOString();
      return dt;
    }
  } catch {
    // fall through
  }

  // Native Temporal fallback when available — try Instant / PlainDate etc.
  if (hasTemporal()) {
    const Temporal = (
      globalThis as unknown as { Temporal?: Record<string, unknown> }
    ).Temporal as Record<string, unknown> | undefined;
    if (Temporal) {
      // Try Duration via native Temporal.Duration
      try {
        const Dur = Temporal.Duration as
          | { from?: (s: string) => unknown }
          | undefined;
        if (s.startsWith('P') && Dur?.from) return Dur.from(s);
      } catch {}
      // Try Instant for UTC datetime
      try {
        const Inst = Temporal.Instant as
          | { from?: (s: string) => unknown }
          | undefined;
        if (s.endsWith('Z') && ISO_DATETIME_RE.test(s) && Inst?.from)
          return Inst.from(s);
      } catch {}
    }
  }

  return undefined;
}
