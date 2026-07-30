import { CROCKFORD_ALPHABET } from './crockford';
import isULID from './isULID';

/**
 * Reads the timestamp back out of a ULID.
 *
 * A ULID leads with a 48-bit count of milliseconds since the Unix epoch — that
 * is what makes it sortable — held in the first ten characters. Decoding it
 * means knowing the alphabet and that the most significant character comes
 * first, which is the sort of thing worth having in one place.
 *
 * Guard with `isULID` when the input is untrusted; a malformed string is
 * rejected rather than decoded into a number that would mean nothing.
 *
 * @param {string} id The ULID to read.
 * @returns {number} Milliseconds since the Unix epoch, as `Date.now()` gives.
 * @throws {TypeError} If the value is not a ULID.
 *
 * @example
 * const id = ulid();
 * ulidTime(id) //=> 1769000000000
 * new Date(ulidTime(id)) //=> the moment it was generated
 *
 * @example
 * ulidTime('01ARYZ6S41TSV4RRFFQ69G5FAV') //=> 1469918176385
 */
export default function ulidTime(id: string): number {
  if (!isULID(id)) {
    throw new TypeError(`Invalid ULID: ${String(id)}`);
  }

  const time = id.slice(0, 10).toUpperCase();
  let result = 0;

  for (const char of time) {
    result = result * 32 + CROCKFORD_ALPHABET.indexOf(char);
  }

  return result;
}
