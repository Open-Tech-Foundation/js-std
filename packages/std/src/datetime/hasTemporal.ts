/**
 * Detects the TC39 Temporal API.
 *
 * Temporal is not yet universal: as of 2026 it is present on Deno, ES-Runtime
 * and Firefox, and on Node.js only behind `--harmony-temporal`. It is absent on
 * Bun, LLRT, default Node.js, Chrome and Safari. `DateTime` therefore uses it
 * when it exists and falls back to `Intl` when it does not, so the detection
 * result must never be assumed.
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
        'Deno, ES-Runtime and Firefox, and on Node.js with --harmony-temporal.',
    );
  }

  return temporal;
}
