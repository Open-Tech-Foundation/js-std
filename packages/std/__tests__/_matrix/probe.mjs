/**
 * Capability probe. Runs on every candidate runtime before the suite so that
 * failures can be attributed to a missing platform API rather than reported as
 * an unexplained red cell.
 *
 * Must stay runtime-agnostic: no `node:` imports, no `process`.
 */
const has = (v) => typeof v !== 'undefined' && v !== null;

/** For capabilities only an actual call can settle. A throw counts as absent. */
const works = (fn) => {
  try {
    return fn() === true;
  } catch {
    return false;
  }
};

const caps = {
  'Intl.Segmenter':
    has(globalThis.Intl) && typeof globalThis.Intl.Segmenter === 'function',
  // Presence of the constructor says nothing here: a runtime built without the
  // name tables still exposes `Intl.DateTimeFormat`, silently ignores `month`
  // and `weekday`, and hands back a numeric date. Only a call reveals it.
  'Intl.DateTimeFormat names': works(
    () =>
      has(globalThis.Intl) &&
      typeof globalThis.Intl.DateTimeFormat === 'function' &&
      new globalThis.Intl.DateTimeFormat('en', {
        month: 'long',
        timeZone: 'UTC',
      }).format(0) === 'January',
  ),
  'Intl.NumberFormat':
    has(globalThis.Intl) && typeof globalThis.Intl.NumberFormat === 'function',
  'Intl.DurationFormat':
    has(globalThis.Intl) &&
    typeof globalThis.Intl.DurationFormat === 'function',
  'Intl.RelativeTimeFormat':
    has(globalThis.Intl) &&
    typeof globalThis.Intl.RelativeTimeFormat === 'function',
  'crypto.getRandomValues':
    typeof globalThis.crypto?.getRandomValues === 'function',
  'crypto.randomUUID': typeof globalThis.crypto?.randomUUID === 'function',
  'crypto.subtle': has(globalThis.crypto?.subtle),
  Blob: typeof globalThis.Blob === 'function',
  'Blob.toStringTag':
    typeof globalThis.Blob === 'function' &&
    Object.prototype.toString.call(new globalThis.Blob([])) === '[object Blob]',
  structuredClone: typeof globalThis.structuredClone === 'function',
  TextEncoder: typeof globalThis.TextEncoder === 'function',
  BigInt: typeof globalThis.BigInt === 'function',
  WeakRef: typeof globalThis.WeakRef === 'function',
  Proxy: typeof globalThis.Proxy === 'function',
};

console.log(`__PROBE_JSON__${JSON.stringify(caps)}`);
