import { getCrypto } from './getCrypto';

/**
 * Computes the SHA-256 hash of a string and returns it as a hex string.
 *
 * Uses the standard Web Crypto API (`crypto.subtle`).
 *
 * @param input - The string to hash.
 * @returns The hex-encoded SHA-256 hash.
 *
 * @example
 *
 * await sha256('hello') //=> '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
 */
export default async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await getCrypto().subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
