import { getCrypto } from './getCrypto';

/**
 * Computes an HMAC-SHA-512 digest of a message with the given key.
 *
 * Uses the standard Web Crypto API (`crypto.subtle`).
 *
 * @param key - The secret key.
 * @param message - The message to authenticate.
 * @returns The hex-encoded HMAC-SHA-512 digest.
 *
 * @example
 *
 * await hmacSHA512('secret', 'hello')
 */
export default async function hmacSHA512(
  key: string,
  message: string,
): Promise<string> {
  const subtle = getCrypto().subtle;
  const encoder = new TextEncoder();
  const cryptoKey = await subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign'],
  );
  const signature = await subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(message),
  );
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
