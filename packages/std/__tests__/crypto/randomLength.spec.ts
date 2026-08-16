import { decodeBase58, encodeBase58, randomId, randomString } from '../../src';

describe('Crypto > random length bounds', () => {
  // `Number.isInteger(1e308)` is true, so a length taken from a caller passed
  // the old check and then looped past the age of the universe, one draw from
  // the random source per character.
  test('refuses a length that is not a safe integer', () => {
    expect(() => randomString(1e308)).toThrow(RangeError);
    expect(() => randomId(1e308)).toThrow(RangeError);
    expect(() => randomString(2 ** 53)).toThrow(RangeError);
  });

  test('refuses a length past the bound', () => {
    expect(() => randomString(65_537)).toThrow(RangeError);
    expect(() => randomId(1_000_000)).toThrow(RangeError);
  });

  test('still refuses a negative or fractional length', () => {
    expect(() => randomString(-1)).toThrow(RangeError);
    expect(() => randomString(1.5)).toThrow(RangeError);
    expect(() => randomId(-1)).toThrow(RangeError);
  });

  test('ordinary lengths are unaffected', () => {
    expect(randomString(10)).toHaveLength(10);
    expect(randomString(0)).toBe('');
    expect(randomId()).toHaveLength(21);
    expect(randomId(64)).toHaveLength(64);
    expect(randomString(65_536)).toHaveLength(65_536);
  });
});

describe('Encoding > decodeBase58 input bound', () => {
  // Base58 has no block structure, so decoding is quadratic in the input
  // length: 16,000 characters take about half a second and 50,000 take five.
  test('refuses an input past the bound', () => {
    expect(() => decodeBase58('z'.repeat(4097))).toThrow(RangeError);
    expect(() => decodeBase58('z'.repeat(100_000))).toThrow(RangeError);
  });

  test('the bound is comfortably above real Base58 payloads', () => {
    // A Bitcoin address is ~35 characters, an IPFS CIDv0 is 46, an xpub 111.
    const address = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2';
    expect(() => decodeBase58(address)).not.toThrow();
    expect(() => decodeBase58('z'.repeat(4096))).not.toThrow();
  });

  test('round-trips within the bound', () => {
    const bytes = new Uint8Array(1024).map((_, i) => i % 256);
    expect(decodeBase58(encodeBase58(bytes))).toEqual(bytes);
  });

  test('completes quickly at the bound', () => {
    const start = performance.now();
    decodeBase58('z'.repeat(4096));
    expect(performance.now() - start).toBeLessThan(2000);
  });
});

describe('Encoding > encodeBase58 input bound', () => {
  test('refuses an input past the bound', () => {
    // 100,000 bytes took 57 seconds before the bound.
    expect(() => encodeBase58(new Uint8Array(3073))).toThrow(RangeError);
    expect(() => encodeBase58(new Uint8Array(100_000))).toThrow(RangeError);
  });

  test('real payloads and the bound itself are fine', () => {
    expect(() => encodeBase58(new Uint8Array(25))).not.toThrow(); // BTC address
    expect(() => encodeBase58(new Uint8Array(34))).not.toThrow(); // IPFS CIDv0
    expect(() => encodeBase58(new Uint8Array(3072))).not.toThrow();
  });
});
