import {
  randomBytes,
  randomId,
  randomInt,
  randomString,
  uuidv4,
  uuidv7,
} from '../../src';

describe('Crypto Utilities', () => {
  test('uuidv4', () => {
    const id = uuidv4();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  test('uuidv7', () => {
    const id1 = uuidv7();
    const id2 = uuidv7();
    expect(id1).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(id1).not.toBe(id2);

    // Check time sorting
    const t1 = Date.now();
    const id3 = uuidv7();
    // The first 48 bits are timestamp
    const tsHex = id3.split('-')[0] + id3.split('-')[1];
    const ts = Number.parseInt(tsHex, 16);
    expect(ts).toBeGreaterThanOrEqual(t1);
  });

  test('randomBytes', () => {
    const bytes = randomBytes(16);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(16);
    expect(randomBytes(16)).not.toEqual(bytes);
  });

  test('randomInt', () => {
    const val = randomInt(1, 10);
    expect(val).toBeGreaterThanOrEqual(1);
    expect(val).toBeLessThanOrEqual(10);
    expect(Number.isInteger(val)).toBe(true);
    expect(() => randomInt(10, 1)).toThrow();
  });

  test('randomString', () => {
    const str = randomString(10);
    expect(str.length).toBe(10);
    expect(typeof str).toBe('string');
    expect(randomString(5, '01')).toMatch(/^[01]{5}$/);
  });

  test('randomId', () => {
    const id = randomId();
    expect(id.length).toBe(21);
    expect(randomId(10).length).toBe(10);
    expect(id).toMatch(/^[A-Za-z0-9_-]{21}$/);
  });
});
