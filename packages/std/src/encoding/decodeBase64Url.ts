import decodeBase64 from './decodeBase64';

/**
 * Decodes a URL-safe Base64 string to bytes.
 *
 * @example
 * decodeBase64Url('aGVsbG8') //=> Uint8Array [104, 101, 108, 108, 111]
 */
export default function decodeBase64Url(str: string): Uint8Array {
  return decodeBase64(str.replace(/-/g, '+').replace(/_/g, '/'));
}
