import isBun from '../runtime/isBun';
import isNode from '../runtime/isNode';

/**
 * Computes an HMAC-SHA-512 digest of a message with the given key.
 *
 * Uses Node.js `crypto` module when available, otherwise falls back to
 * the Web Crypto API (`SubtleCrypto`).
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
  if (isNode() || isBun()) {
    // @ts-ignore — Node.js/Bun only
    const { createHmac } = await import('node:crypto');
    return createHmac('sha512', key).update(message).digest('hex');
  }

  // Browser / Deno — SubtleCrypto
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(message),
  );
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
