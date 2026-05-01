import isBun from '../runtime/isBun';
import isNode from '../runtime/isNode';

/**
 * Computes the SHA-256 hash of a string and returns it as a hex string.
 *
 * Uses Node.js `crypto` module when available, otherwise falls back to
 * the Web Crypto API (`SubtleCrypto`).
 *
 * @param input - The string to hash.
 * @returns The hex-encoded SHA-256 hash.
 *
 * @example
 *
 * await sha256('hello') //=> '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
 */
export default async function sha256(input: string): Promise<string> {
  if (isNode() || isBun()) {
    // @ts-ignore — Node.js/Bun only
    const { createHash } = await import('node:crypto');
    return createHash('sha256').update(input).digest('hex');
  }

  // Browser / Deno — SubtleCrypto (always async)
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
