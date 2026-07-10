import { getCrypto } from './getCrypto';

/**
 * Generates cryptographically strong random values.
 *
 * Uses Web Crypto when available and falls back to `node:crypto.webcrypto`
 * in Node-compatible environments.
 *
 * @example
 *
 * randomBytes(16) //=> Uint8Array(16) [...]
 */
export default function randomBytes(size: number): Uint8Array {
  if (!Number.isInteger(size) || size < 0) {
    throw new RangeError('The size must be a non-negative integer.');
  }

  const bytes = new Uint8Array(size);
  getCrypto().getRandomValues(bytes);
  return bytes;
}
