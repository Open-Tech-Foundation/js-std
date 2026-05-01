import isBun from '../runtime/isBun';
import isNode from '../runtime/isNode';

/**
 * Computes the SHA-512 hash of a string and returns it as a hex string.
 *
 * Uses Node.js `crypto` module when available, otherwise falls back to
 * the Web Crypto API (`SubtleCrypto`).
 *
 * @param input - The string to hash.
 * @returns The hex-encoded SHA-512 hash.
 *
 * @example
 *
 * await sha512('hello') //=> '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043'
 */
export default async function sha512(input: string): Promise<string> {
  if (isNode() || isBun()) {
    // @ts-ignore — Node.js/Bun only
    const { createHash } = await import('node:crypto');
    return createHash('sha512').update(input).digest('hex');
  }

  // Browser / Deno — SubtleCrypto (always async)
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
