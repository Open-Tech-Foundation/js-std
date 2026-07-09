/**
 * Computes an HMAC-SHA-512 digest of a message with the given key.
 *
 * Uses Web Crypto when available, otherwise falls back to Node-compatible
 * `node:crypto`.
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
  if (globalThis.crypto?.subtle) {
    const encoder = new TextEncoder();
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign'],
    );
    const signature = await globalThis.crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      encoder.encode(message),
    );
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  try {
    const { createHmac } = await import(
      /* webpackIgnore: true */ 'node:crypto'
    );
    return createHmac('sha512', key).update(message).digest('hex');
  } catch {
    throw new Error('hmacSHA512 requires Web Crypto or node:crypto support.');
  }
}
