import DateTime from '../datetime/DateTime';
import Duration from '../datetime/Duration';
import { hasTemporal } from '../datetime/hasTemporal';

export interface TryStringifyJSONOptions {
  replacer?:
    | ((key: string, value: unknown) => unknown)
    | (string | number)[]
    | null;
  space?: string | number;
  temporal?: boolean;
}

/**
 * Safely stringifies a value to JSON without throwing.
 *
 * - `bigint` values are stringified as decimal strings by default (native
 *   `JSON.stringify` throws `TypeError` on `bigint`).
 * - `DateTime`, `Duration` and native `Temporal` objects are stringified via
 *   their ISO `toString()` by default (like `bigint`), before `replacer`.
 *   Pass `temporal:false` to disable.
 * - If `replacer` is a function, `bigint`/`temporal` conversion happens before calling it.
 * - If `replacer` is an array, only listed keys are kept and `bigint`/`temporal` values
 *   within them are still stringified.
 * - On circular structures or when `JSON.stringify` returns `undefined`
 *   (e.g. `undefined`, `function`, `symbol` at top-level), returns `fallback`
 *   (or `undefined` if no fallback).
 *
 * @param value The value to stringify.
 * @param fallback Value to return on failure. Defaults to `undefined`.
 * @param options `replacer` and `space` passed to `JSON.stringify`.
 * @returns The JSON string or the fallback.
 *
 * @example
 * tryStringifyJSON({a:1}) //=> '{"a":1}'
 * tryStringifyJSON({n: BigInt(1)}) //=> '{"n":"1"}'
 * tryStringifyJSON(BigInt(1)) //=> '"123"'
 * tryStringifyJSON({a:1}, undefined, {space:2}) //=> '{\n  "a": 1\n}'
 * const o:any={}; o.self=o; tryStringifyJSON(o) //=> undefined
 * tryStringifyJSON(o, '{}') //=> '{}'
 * tryStringifyJSON({t: new DateTime("2024-01-01")}) //=> '{"t":"2024-01-01T00:00:00.000+00:00[UTC]"}'
 */
export default function tryStringifyJSON(
  value: unknown,
  fallback?: string,
  options?: TryStringifyJSONOptions,
): string | undefined {
  const replacer = options?.replacer;
  const space = options?.space;
  const temporal = options?.temporal ?? true;

  let finalReplacer:
    | ((key: string, value: unknown) => unknown)
    | (string | number)[]
    | undefined
    | null;

  const toTemporalString = (v: unknown): unknown => {
    if (!temporal) return v;
    // DateTime / Duration from @opentf/std
    if (v instanceof DateTime || v instanceof Duration) {
      try {
        return (v as { toString(): string }).toString();
      } catch {
        return v;
      }
    }
    // Native Temporal — check brand via toString and constructor name
    if (hasTemporal() && v != null && typeof v === 'object') {
      const name = (v as { constructor?: { name?: string } }).constructor?.name;
      if (
        name === 'Instant' ||
        name === 'ZonedDateTime' ||
        name === 'PlainDate' ||
        name === 'PlainDateTime' ||
        name === 'PlainTime' ||
        name === 'PlainYearMonth' ||
        name === 'PlainMonthDay' ||
        name === 'Duration'
      ) {
        try {
          return (v as { toString(): string }).toString();
        } catch {
          return v;
        }
      }
      // Fallback: any Temporal object will have toString that looks ISO-like
      // Use duck check for Temporal-like toString
      if (
        typeof (v as { toString?: unknown }).toString === 'function' &&
        name?.startsWith('Temporal')
      ) {
        try {
          return (v as { toString(): string }).toString();
        } catch {
          return v;
        }
      }
    }
    return v;
  };

  const bigIntAndTemporal = (v: unknown): unknown => {
    let out: unknown = v;
    if (typeof out === 'bigint') out = (out as bigint).toString();
    out = toTemporalString(out);
    return out;
  };

  if (replacer == null) {
    finalReplacer = (_key: string, v: unknown) =>
      bigIntAndTemporal(v) as unknown;
  } else if (typeof replacer === 'function') {
    const userFn = replacer as (key: string, value: unknown) => unknown;
    finalReplacer = (key: string, v: unknown) => {
      const bv = bigIntAndTemporal(v);
      return userFn(key, bv);
    };
  } else if (Array.isArray(replacer)) {
    const set = new Set(replacer.map(String));
    finalReplacer = (key: string, v: unknown) => {
      const bv = bigIntAndTemporal(v);
      if (key === '') return bv;
      return set.has(key) ? bv : undefined;
    };
  } else {
    finalReplacer = replacer;
  }

  try {
    const result = JSON.stringify(
      value,
      finalReplacer as (key: string, value: unknown) => unknown,
      space as string | number | undefined,
    );
    if (result === undefined) return fallback as string | undefined;
    return result;
  } catch {
    return fallback as string | undefined;
  }
}
