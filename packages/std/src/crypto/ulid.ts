import { CROCKFORD_ALPHABET as ALPHABET } from './crockford';
import { getCrypto } from './getCrypto';

const TIME_LENGTH = 10;
const RANDOM_LENGTH = 16;

// The timestamp is 48 bits, so it runs out in the year 10889.
const MAX_TIME = 281474976710655;

/**
 * Generates a ULID: a 128-bit, lexicographically sortable identifier.
 *
 * The first 48 bits are the timestamp in milliseconds and the remaining 80 are
 * random, encoded together as 26 characters of Crockford's Base32. Because the
 * time leads and the encoding preserves order, sorting the strings sorts by
 * creation time — no separate column, and no parsing to compare two of them.
 *
 * It is 26 characters against a UUID's 36, uses no hyphens, and is safe in a
 * URL, a filename and a double-click selection. The alphabet leaves out `I`,
 * `L`, `O` and `U`, so nothing in it can be misread as a digit or as `V`.
 *
 * A ULID is not a UUID and will not pass a UUID column or validator. Reach for
 * `uuidv7` when the shape has to be a UUID; the two carry the same idea.
 *
 * Ordering holds *between* milliseconds, not within one: two ULIDs made in the
 * same millisecond differ only in their random half, so their relative order is
 * arbitrary. That is the behaviour the specification defines for this function,
 * and the reason it recommends a monotonic factory where same-millisecond order
 * has to be stable.
 *
 * @param {number} [seedTime=Date.now()] The timestamp to encode, in milliseconds.
 * @returns {string} A 26-character ULID.
 * @throws {RangeError} If `seedTime` is not an integer within the 48-bit range.
 *
 * @example
 * ulid() //=> '01ARZ3NDEKTSV4RRFFQ69G5FAV'
 *
 * @example
 * // Sorting the strings sorts by creation time.
 * [ulid(), ulid(), ulid()].sort()
 *
 * @example
 * // A fixed time gives a fixed 10-character prefix.
 * ulid(1469918176385).slice(0, 10) //=> '01ARYZ6S41'
 */
export default function ulid(seedTime: number = Date.now()): string {
  if (!Number.isInteger(seedTime) || seedTime < 0 || seedTime > MAX_TIME) {
    throw new RangeError(
      `The seed time must be an integer between 0 and ${MAX_TIME}.`,
    );
  }

  // Most significant character first, so the encoding keeps the order of the
  // numbers it came from. Division rather than bit shifts: the value is 48
  // bits and JavaScript's bitwise operators work on 32.
  let remaining = seedTime;
  const time = new Array<string>(TIME_LENGTH);
  for (let i = TIME_LENGTH - 1; i >= 0; i--) {
    time[i] = ALPHABET[remaining % 32];
    remaining = Math.floor(remaining / 32);
  }

  // One byte per character, masked to five bits. 256 is a whole multiple of
  // 32, so every symbol is equally likely and the mask introduces no bias.
  const bytes = new Uint8Array(RANDOM_LENGTH);
  getCrypto().getRandomValues(bytes);

  const random = new Array<string>(RANDOM_LENGTH);
  for (let i = 0; i < RANDOM_LENGTH; i++) {
    random[i] = ALPHABET[bytes[i] & 31];
  }

  return time.join('') + random.join('');
}
