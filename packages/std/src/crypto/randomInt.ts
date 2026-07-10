import { getCrypto } from './getCrypto';

/**
 * Generates a cryptographically strong random integer within a range.
 *
 * Uses Web Crypto when available and falls back to `node:crypto.webcrypto`
 * in Node-compatible environments.
 *
 * @example
 *
 * randomInt(1, 10) //=> 7
 */
export default function randomInt(min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new RangeError('The min and max values must be integers.');
  }

  if (min > max) {
    throw new Error(
      'The min value must be less than or equal to the max value.',
    );
  }
  const range = max - min + 1;
  const maxUint32 = 4294967295;
  const array = new Uint32Array(1);
  let val: number;
  do {
    getCrypto().getRandomValues(array);
    val = array[0];
  } while (val > maxUint32 - (maxUint32 % range));
  return min + (val % range);
}
