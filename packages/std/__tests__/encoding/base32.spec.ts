import {
  bytesToString,
  decodeBase32,
  encodeBase32,
  stringToBytes,
} from '../../src';

// RFC 4648 section 10 test vectors.
const RFC_4648_VECTORS: [string, string][] = [
  ['', ''],
  ['f', 'MY======'],
  ['fo', 'MZXQ===='],
  ['foo', 'MZXW6==='],
  ['foob', 'MZXW6YQ='],
  ['fooba', 'MZXW6YTB'],
  ['foobar', 'MZXW6YTBOI======'],
];

describe('Base32', () => {
  test('matches the RFC 4648 test vectors', () => {
    for (const [input, expected] of RFC_4648_VECTORS) {
      expect(encodeBase32(stringToBytes(input))).toBe(expected);
      expect(bytesToString(decodeBase32(expected))).toBe(input);
    }
  });

  test('omits padding when asked', () => {
    expect(encodeBase32(stringToBytes('f'), { pad: false })).toBe('MY');
    expect(encodeBase32(stringToBytes('foobar'), { pad: false })).toBe(
      'MZXW6YTBOI',
    );
    // A full group needs no padding either way.
    expect(encodeBase32(stringToBytes('fooba'), { pad: false })).toBe(
      'MZXW6YTB',
    );
  });

  test('decodes unpadded input', () => {
    expect(bytesToString(decodeBase32('MY'))).toBe('f');
    expect(bytesToString(decodeBase32('MZXW6YTBOI'))).toBe('foobar');
  });

  test('decodes lowercase and whitespaced input', () => {
    // The form a TOTP secret is usually shown in.
    expect(bytesToString(decodeBase32('mzxw6ytboi'))).toBe('foobar');
    expect(bytesToString(decodeBase32('MZXW 6YTB OI'))).toBe('foobar');
    expect(bytesToString(decodeBase32('mzxw 6ytb oi======'))).toBe('foobar');
  });

  test('handles an empty input', () => {
    expect(encodeBase32(new Uint8Array([]))).toBe('');
    expect(decodeBase32('')).toEqual(new Uint8Array([]));
  });

  test('accepts an ArrayBuffer', () => {
    const bytes = stringToBytes('foobar');
    expect(encodeBase32(bytes.buffer)).toBe('MZXW6YTBOI======');
  });

  test('rejects truncated strings', () => {
    // Lengths 1, 3 and 6 mod 8 cannot be produced by whole bytes.
    expect(() => decodeBase32('M')).toThrow('Invalid Base32 string length.');
    expect(() => decodeBase32('MZX')).toThrow('Invalid Base32 string length.');
    expect(() => decodeBase32('MZXW6Y')).toThrow(
      'Invalid Base32 string length.',
    );
  });

  test('rejects characters outside the alphabet', () => {
    // 0, 1 and 8 are excluded from the RFC 4648 alphabet.
    expect(() => decodeBase32('MZXW6Y0B')).toThrow('Invalid Base32 character.');
    expect(() => decodeBase32('MZXW6Y1B')).toThrow('Invalid Base32 character.');
    expect(() => decodeBase32('MZXW6Y8B')).toThrow('Invalid Base32 character.');
    expect(() => decodeBase32('MZXW6Y-B')).toThrow('Invalid Base32 character.');
  });

  test('rejects padding in the middle of the string', () => {
    expect(() => decodeBase32('MY======MY======')).toThrow(
      'Invalid Base32 padding.',
    );
  });

  test('round-trips arbitrary bytes at every length', () => {
    for (let length = 0; length <= 64; length++) {
      const bytes = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        bytes[i] = (i * 37 + length * 11) % 256;
      }

      expect(decodeBase32(encodeBase32(bytes))).toEqual(bytes);
      expect(decodeBase32(encodeBase32(bytes, { pad: false }))).toEqual(bytes);
    }
  });

  test('round-trips every single byte value', () => {
    for (let byte = 0; byte < 256; byte++) {
      const bytes = new Uint8Array([byte]);
      expect(decodeBase32(encodeBase32(bytes))).toEqual(bytes);
    }
  });

  test('pads to a multiple of eight characters', () => {
    for (let length = 1; length <= 20; length++) {
      const encoded = encodeBase32(new Uint8Array(length));
      expect(encoded.length % 8).toBe(0);
    }
  });
});
