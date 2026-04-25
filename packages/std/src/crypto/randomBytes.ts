/**
 * Generates cryptographically strong random values.
 *
 * @example
 *
 * randomBytes(16) //=> Uint8Array(16) [...]
 */
export default function randomBytes(size: number): Uint8Array {
  const bytes = new Uint8Array(size);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}
