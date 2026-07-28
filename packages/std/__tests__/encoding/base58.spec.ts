import {
  bytesToString,
  decodeBase58,
  encodeBase58,
  stringToBytes,
} from '../../src';

const BASE58_ALPHABET =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * An independent reference encoder built on `BigInt`, so the specs check the
 * incremental byte-array algorithm against a different one rather than against
 * itself.
 */
function referenceEncode(bytes: Uint8Array): string {
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) {
    zeros++;
  }

  let value = 0n;
  for (const byte of bytes.slice(zeros)) {
    value = value * 256n + BigInt(byte);
  }

  let out = '';
  while (value > 0n) {
    out = BASE58_ALPHABET[Number(value % 58n)] + out;
    value /= 58n;
  }

  return '1'.repeat(zeros) + out;
}

describe('Base58', () => {
  test('matches published test vectors', () => {
    expect(encodeBase58(stringToBytes('Hello'))).toBe('9Ajdvzr');
    expect(encodeBase58(stringToBytes('hello world'))).toBe('StV1DL6CwTryKyV');
    expect(encodeBase58(stringToBytes('Hello World!'))).toBe(
      '2NEpo7TZRRrLZSi2U',
    );
    expect(encodeBase58(stringToBytes('a'))).toBe('2g');

    expect(bytesToString(decodeBase58('9Ajdvzr'))).toBe('Hello');
    expect(bytesToString(decodeBase58('StV1DL6CwTryKyV'))).toBe('hello world');
    expect(bytesToString(decodeBase58('2NEpo7TZRRrLZSi2U'))).toBe(
      'Hello World!',
    );
  });

  test('preserves leading zero bytes as leading ones', () => {
    expect(encodeBase58(new Uint8Array([0]))).toBe('1');
    expect(encodeBase58(new Uint8Array([0, 0]))).toBe('11');
    expect(encodeBase58(new Uint8Array([0, 0, 1]))).toBe('112');
    expect(encodeBase58(new Uint8Array([0, 0, 0, 0]))).toBe('1111');

    expect(decodeBase58('1')).toEqual(new Uint8Array([0]));
    expect(decodeBase58('11')).toEqual(new Uint8Array([0, 0]));
    expect(decodeBase58('112')).toEqual(new Uint8Array([0, 0, 1]));
    expect(decodeBase58('1111')).toEqual(new Uint8Array([0, 0, 0, 0]));
  });

  test('handles an empty input', () => {
    expect(encodeBase58(new Uint8Array([]))).toBe('');
    expect(decodeBase58('')).toEqual(new Uint8Array([]));
  });

  test('encodes the maximum byte values', () => {
    expect(encodeBase58(new Uint8Array([255, 255]))).toBe('LUv');
    expect(decodeBase58('LUv')).toEqual(new Uint8Array([255, 255]));
  });

  test('accepts an ArrayBuffer', () => {
    const bytes = stringToBytes('Hello');
    expect(encodeBase58(bytes.buffer)).toBe('9Ajdvzr');
  });

  test('rejects the visually ambiguous characters', () => {
    for (const char of ['0', 'O', 'I', 'l']) {
      expect(() => decodeBase58(`9Ajd${char}zr`)).toThrow(
        'Invalid Base58 character.',
      );
    }
  });

  test('rejects characters outside the alphabet', () => {
    expect(() => decodeBase58('9Ajd+zr')).toThrow('Invalid Base58 character.');
    expect(() => decodeBase58('hello world')).toThrow(
      'Invalid Base58 character.',
    );
  });

  test('is case sensitive', () => {
    expect(encodeBase58(stringToBytes('Hello'))).not.toBe(
      encodeBase58(stringToBytes('hello')),
    );
  });

  test('agrees with a BigInt reference encoder', () => {
    for (let length = 0; length <= 48; length++) {
      const bytes = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        bytes[i] = (i * 53 + length * 17) % 256;
      }

      expect(encodeBase58(bytes)).toBe(referenceEncode(bytes));
    }
  });

  test('agrees with the reference encoder on zero-prefixed input', () => {
    for (let zeros = 0; zeros <= 8; zeros++) {
      const bytes = new Uint8Array([
        ...new Uint8Array(zeros),
        ...[7, 200, 13, 255, 1],
      ]);

      expect(encodeBase58(bytes)).toBe(referenceEncode(bytes));
    }
  });

  test('round-trips arbitrary bytes at every length', () => {
    for (let length = 0; length <= 64; length++) {
      const bytes = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        bytes[i] = (i * 37 + length * 11) % 256;
      }

      expect(decodeBase58(encodeBase58(bytes))).toEqual(bytes);
    }
  });

  test('round-trips every single byte value', () => {
    for (let byte = 0; byte < 256; byte++) {
      const bytes = new Uint8Array([byte]);
      expect(decodeBase58(encodeBase58(bytes))).toEqual(bytes);
    }
  });

  test('round-trips a 32-byte key, the common real-world size', () => {
    const key = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      key[i] = (i * 7 + 3) % 256;
    }

    const encoded = encodeBase58(key);
    expect(encoded).toBe(referenceEncode(key));
    expect(decodeBase58(encoded)).toEqual(key);
  });
});
