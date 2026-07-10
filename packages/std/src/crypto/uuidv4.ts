import { randomUUIDv4 } from './getCrypto';

/**
 * Generates a random UUID v4.
 *
 * Uses Web Crypto when available and falls back to `node:crypto`
 * in Node-compatible environments.
 *
 * @returns {string} A random UUID v4 string.
 *
 * @example
 * uuidv4() //=> 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
 */
export default function uuidv4(): string {
  return randomUUIDv4();
}
