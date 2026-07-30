import { ulid } from '../../src';

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const MAX_TIME = 281474976710655;

/**
 * Decodes the timestamp back out of a ULID, written out here rather than
 * imported so the test pins the encoding instead of restating it.
 */
function decodeTime(id: string): number {
  return [...id.slice(0, 10)].reduce(
    (acc, char) => acc * 32 + ALPHABET.indexOf(char),
    0,
  );
}

describe('Crypto > ulid', () => {
  test('is 26 characters long', () => {
    expect(ulid()).toHaveLength(26);
    expect(ulid(0)).toHaveLength(26);
    expect(ulid(MAX_TIME)).toHaveLength(26);
  });

  test("uses only Crockford's Base32", () => {
    for (let i = 0; i < 200; i++) {
      expect(ulid()).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    }
  });

  test('never emits the letters that are misread', () => {
    // I, L, O and U are left out so nothing reads as 1, 0 or V.
    const drawn = Array.from({ length: 500 }, () => ulid()).join('');

    for (const char of 'ILOU') {
      expect(drawn).not.toContain(char);
    }
  });

  test('matches the specification test vector', () => {
    expect(ulid(1469918176385).slice(0, 10)).toBe('01ARYZ6S41');
  });

  test('round-trips the timestamp it was given', () => {
    const times = [0, 1, 1469918176385, Date.now(), MAX_TIME];

    for (const time of times) {
      expect(decodeTime(ulid(time))).toBe(time);
    }
  });

  test('encodes the current time by default', () => {
    const before = Date.now();
    const decoded = decodeTime(ulid());
    const after = Date.now();

    expect(decoded).toBeGreaterThanOrEqual(before);
    expect(decoded).toBeLessThanOrEqual(after);
  });

  test('sorts lexicographically by time', () => {
    const times = [0, 1, 1000, 1469918176385, 1700000000000, MAX_TIME];
    const ids = times.map((t) => ulid(t));

    expect([...ids].sort()).toEqual(ids);
  });

  test('fills the ends of the time range', () => {
    expect(ulid(0).slice(0, 10)).toBe('0000000000');
    expect(ulid(MAX_TIME).slice(0, 10)).toBe('7ZZZZZZZZZ');
  });

  test('differs in the random half for the same timestamp', () => {
    const ids = new Set(Array.from({ length: 200 }, () => ulid(1000)));

    expect(ids.size).toBe(200);
    for (const id of ids) {
      expect(id.slice(0, 10)).toBe(ulid(1000).slice(0, 10));
    }
  });

  test('draws every symbol in the random half', () => {
    // A masking bug that lost the top bit would leave half the alphabet unused.
    const random = Array.from({ length: 2000 }, () => ulid().slice(10)).join(
      '',
    );

    for (const char of ALPHABET) {
      expect(random).toContain(char);
    }
  });

  test('rejects a seed time outside the 48-bit range', () => {
    const message = `The seed time must be an integer between 0 and ${MAX_TIME}.`;

    expect(() => ulid(-1)).toThrow(message);
    expect(() => ulid(MAX_TIME + 1)).toThrow(message);
    expect(() => ulid(1.5)).toThrow(message);
    expect(() => ulid(Number.NaN)).toThrow(RangeError);
    expect(() => ulid(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});
