import {
  isULID,
  isUUID,
  ulid,
  ulidTime,
  uuidv4,
  uuidv7,
  uuidv7Time,
} from '../../src';

const NIL = '00000000-0000-0000-0000-000000000000';
const MAX = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

/** A well-formed UUID carrying the given version nibble. */
function uuidOfVersion(version: number): string {
  return `f47ac10b-58cc-${version}372-a567-0e02b2c3d479`;
}

describe('Crypto > isUUID', () => {
  test('accepts what this module generates', () => {
    for (let i = 0; i < 50; i++) {
      expect(isUUID(uuidv4())).toBe(true);
      expect(isUUID(uuidv7())).toBe(true);
    }
  });

  test('accepts every version RFC 9562 defines', () => {
    // Version 7 matters most here: the older RFC 4122 rule stops at 5 and
    // would reject this module's own output.
    for (let version = 1; version <= 8; version++) {
      expect(isUUID(uuidOfVersion(version))).toBe(true);
      expect(isUUID(uuidOfVersion(version), version)).toBe(true);
    }
  });

  test('rejects a version nibble outside that range', () => {
    expect(isUUID('f47ac10b-58cc-0372-a567-0e02b2c3d479')).toBe(false);
    expect(isUUID('f47ac10b-58cc-9372-a567-0e02b2c3d479')).toBe(false);
  });

  test('rejects a variant the format does not reserve', () => {
    // The third group must start 8, 9, a or b — the `10xx` variant bits.
    for (const variant of ['0', '7', 'c', 'f']) {
      expect(isUUID(`f47ac10b-58cc-4372-${variant}567-0e02b2c3d479`)).toBe(
        false,
      );
    }
    for (const variant of ['8', '9', 'a', 'b']) {
      expect(isUUID(`f47ac10b-58cc-4372-${variant}567-0e02b2c3d479`)).toBe(
        true,
      );
    }
  });

  test('filters by version', () => {
    const v4 = uuidv4();
    const v7 = uuidv7();

    expect(isUUID(v4, 4)).toBe(true);
    expect(isUUID(v4, 7)).toBe(false);
    expect(isUUID(v7, 7)).toBe(true);
    expect(isUUID(v7, 4)).toBe(false);
  });

  test('accepts the Nil and Max UUIDs, which carry no version', () => {
    expect(isUUID(NIL)).toBe(true);
    expect(isUUID(MAX)).toBe(true);
    expect(isUUID(MAX.toUpperCase())).toBe(true);

    // Having no version, neither can satisfy a version filter.
    for (let version = 1; version <= 8; version++) {
      expect(isUUID(NIL, version)).toBe(false);
      expect(isUUID(MAX, version)).toBe(false);
    }
  });

  test('is case-insensitive', () => {
    const id = uuidv4();

    expect(isUUID(id.toUpperCase())).toBe(true);
    expect(isUUID(id.toUpperCase(), 4)).toBe(true);
  });

  test('requires the hyphens, in place', () => {
    const id = uuidv4();

    expect(isUUID(id.replace(/-/g, ''))).toBe(false);
    expect(isUUID(`${id}-`)).toBe(false);
    expect(isUUID(` ${id}`)).toBe(false);
    expect(isUUID(id.slice(0, -1))).toBe(false);
  });

  test('rejects a non-string without throwing', () => {
    for (const val of [undefined, null, 42, {}, [], true, Symbol('x')]) {
      expect(isUUID(val)).toBe(false);
    }
  });

  test('throws on a version that is not one to eight', () => {
    const message = 'The version must be an integer between 1 and 8.';

    expect(() => isUUID(uuidv4(), 0)).toThrow(message);
    expect(() => isUUID(uuidv4(), 9)).toThrow(message);
    expect(() => isUUID(uuidv4(), 4.5)).toThrow(message);
    // The check runs before the value is looked at, so a bad version is
    // reported even when the value could never have matched.
    expect(() => isUUID('nope', 0)).toThrow(RangeError);
  });
});

describe('Crypto > uuidv7Time', () => {
  test('reads back the time a generated id was made at', () => {
    const before = Date.now();
    const id = uuidv7();
    const after = Date.now();
    const decoded = uuidv7Time(id);

    expect(decoded).toBeGreaterThanOrEqual(before);
    expect(decoded).toBeLessThanOrEqual(after);
  });

  test('decodes a known layout', () => {
    // 0x01912d68783e, which is 2024-08-07T15:15:06.942Z.
    expect(uuidv7Time('01912d68-783e-7000-8000-000000000000')).toBe(
      Date.UTC(2024, 7, 7, 15, 15, 6, 942),
    );

    // The ends of the 48-bit range.
    expect(uuidv7Time('00000000-0000-7000-8000-000000000000')).toBe(0);
    expect(uuidv7Time('ffffffff-ffff-7fff-bfff-ffffffffffff')).toBe(
      281474976710655,
    );
  });

  test('orders with the ids themselves', () => {
    const ids = Array.from({ length: 20 }, () => uuidv7());
    const times = ids.map(uuidv7Time);

    expect([...times].sort((a, b) => a - b)).toEqual(times);
  });

  test('throws on anything that is not a v7', () => {
    expect(() => uuidv7Time(uuidv4())).toThrow(TypeError);
    expect(() => uuidv7Time(NIL)).toThrow(TypeError);
    expect(() => uuidv7Time('nope')).toThrow('Invalid UUID v7: nope');
    // @ts-expect-error deliberately not a string
    expect(() => uuidv7Time(null)).toThrow(TypeError);
  });
});

describe('Crypto > isULID', () => {
  test('accepts what ulid generates', () => {
    for (let i = 0; i < 50; i++) {
      expect(isULID(ulid())).toBe(true);
    }
    expect(isULID(ulid(0))).toBe(true);
    expect(isULID(ulid(281474976710655))).toBe(true);
  });

  test('accepts either case', () => {
    const id = ulid();

    expect(isULID(id)).toBe(true);
    expect(isULID(id.toLowerCase())).toBe(true);
  });

  test('requires exactly 26 characters', () => {
    const id = ulid();

    expect(isULID(id.slice(0, 25))).toBe(false);
    expect(isULID(`${id}0`)).toBe(false);
    expect(isULID('')).toBe(false);
  });

  test('rejects a timestamp that would overflow 48 bits', () => {
    // Ten Base32 characters hold fifty bits; the timestamp is forty-eight.
    const body = ulid().slice(1);

    expect(isULID(`7${body}`)).toBe(true);
    expect(isULID(`8${body}`)).toBe(false);
    expect(isULID(`Z${body}`)).toBe(false);
  });

  test('rejects the letters left out of the alphabet', () => {
    const body = ulid().slice(0, 25);

    for (const char of 'ILOU') {
      expect(isULID(body + char)).toBe(false);
      expect(isULID(body + char.toLowerCase())).toBe(false);
    }
  });

  test('rejects a non-string without throwing', () => {
    for (const val of [undefined, null, 42, {}, [], true]) {
      expect(isULID(val)).toBe(false);
    }
  });

  test('does not confuse a UUID for a ULID', () => {
    expect(isULID(uuidv4())).toBe(false);
    expect(isUUID(ulid())).toBe(false);
  });
});

describe('Crypto > ulidTime', () => {
  test('round-trips the seed time', () => {
    for (const time of [0, 1, 1469918176385, Date.now(), 281474976710655]) {
      expect(ulidTime(ulid(time))).toBe(time);
    }
  });

  test('decodes the specification vector', () => {
    expect(ulidTime('01ARYZ6S41TSV4RRFFQ69G5FAV')).toBe(1469918176385);
  });

  test('reads back the time a generated id was made at', () => {
    const before = Date.now();
    const id = ulid();
    const after = Date.now();
    const decoded = ulidTime(id);

    expect(decoded).toBeGreaterThanOrEqual(before);
    expect(decoded).toBeLessThanOrEqual(after);
  });

  test('accepts either case', () => {
    const id = ulid(1469918176385);

    expect(ulidTime(id.toLowerCase())).toBe(1469918176385);
  });

  test('throws on anything that is not a ULID', () => {
    expect(() => ulidTime('nope')).toThrow('Invalid ULID: nope');
    expect(() => ulidTime(uuidv4())).toThrow(TypeError);
    expect(() => ulidTime(`8${ulid().slice(1)}`)).toThrow(TypeError);
    // @ts-expect-error deliberately not a string
    expect(() => ulidTime(null)).toThrow(TypeError);
  });
});

describe('Crypto > identifiers agree with each other', () => {
  test('a v7 and a ULID made from one time decode to it', () => {
    const time = 1469918176385;

    expect(ulidTime(ulid(time))).toBe(time);
    // Built by hand: 48 bits of time, then the version and variant nibbles.
    const hex = time.toString(16).padStart(12, '0');
    const v7 = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-7000-8000-000000000000`;

    expect(uuidv7Time(v7)).toBe(time);
  });

  test('each guard rejects the other family', () => {
    const ids = [uuidv4(), uuidv7(), NIL, MAX];

    for (const id of ids) {
      expect(isULID(id)).toBe(false);
    }
    expect(isUUID(ulid())).toBe(false);
  });
});
