/**
 * Returns the standard Web Crypto API (`globalThis.crypto`).
 *
 * Every runtime `@opentf/std` targets — Node.js >= 20, Bun, Deno, browsers and
 * edge workers — exposes Web Crypto globally, so no runtime-specific fallback
 * is needed.
 */
export function getCrypto(): Crypto {
  if (globalThis.crypto) {
    return globalThis.crypto;
  }

  throw new Error(
    'Crypto helpers require the Web Crypto API (globalThis.crypto).',
  );
}

export function randomUUIDv4(): string {
  const crypto = getCrypto();

  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));

  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex
    .slice(6, 8)
    .join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}
