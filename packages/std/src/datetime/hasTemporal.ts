/**
 * Detects the TC39 Temporal API.
 *
 * Temporal is not yet universal: as of 2026 it is present on Node.js 26+, Deno,
 * ES-Runtime, Chrome and Edge 144+, and Firefox 139+. Node.js 24 and 25 have it
 * only behind `--harmony-temporal`, and it is absent on Node.js 22 and earlier,
 * Bun, LLRT and Safari. `DateTime` therefore uses it when it exists and falls
 * back to `Intl` when it does not, so the detection result must never be
 * assumed.
 *
 * Revisions differ too: the Temporal in Node.js 24/25 predates `timeZoneId` and
 * exposes a `timeZone` object instead, which `DateTime.fromTemporal` handles.
 */

let cached: boolean | undefined;

interface TemporalGlobal {
  Instant: {
    fromEpochMilliseconds(ms: number): unknown;
  };
  ZonedDateTime: {
    from(item: unknown, options?: unknown): unknown;
  };
}

function read(): TemporalGlobal | undefined {
  return (globalThis as { Temporal?: TemporalGlobal }).Temporal;
}

/** Whether this runtime exposes a usable `Temporal` global. */
export function hasTemporal(): boolean {
  if (cached === undefined) {
    const temporal = read();

    cached =
      typeof temporal?.Instant?.fromEpochMilliseconds === 'function' &&
      typeof temporal?.ZonedDateTime?.from === 'function';
  }

  return cached;
}

/**
 * Returns the `Temporal` global.
 *
 * @throws {Error} When the runtime does not provide Temporal.
 */
export function getTemporal(): TemporalGlobal {
  const temporal = read();

  if (!hasTemporal() || !temporal) {
    throw new Error(
      'This runtime does not provide the Temporal API. It is available on ' +
        'Node.js 26+, Deno, ES-Runtime, Chrome/Edge 144+ and Firefox 139+, ' +
        'and on Node.js 24/25 with --harmony-temporal.',
    );
  }

  return temporal;
}
