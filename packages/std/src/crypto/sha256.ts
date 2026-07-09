/**
 * Computes the SHA-256 hash of a string and returns it as a hex string.
 *
 * Uses Web Crypto when available, otherwise falls back to Node-compatible
 * `node:crypto`.
 *
 * @param input - The string to hash.
 * @returns The hex-encoded SHA-256 hash.
 *
 * @example
 *
 * await sha256('hello') //=> '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
 */
export default async function sha256(input: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  try {
    const { createHash } = await import(
      /* webpackIgnore: true */ 'node:crypto'
    );
    return createHash('sha256').update(input).digest('hex');
  } catch {
    throw new Error('sha256 requires Web Crypto or node:crypto support.');
  }
}
