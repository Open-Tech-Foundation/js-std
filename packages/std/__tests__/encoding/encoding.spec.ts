import {
  bytesToString,
  decodeBase64,
  decodeBase64Url,
  decodeHex,
  encodeBase64,
  encodeBase64Url,
  encodeHex,
  stringToBytes,
} from '../../src';

describe('Encoding Utilities', () => {
  test('Base64', () => {
    const original = 'Hello World';
    const bytes = stringToBytes(original);
    const encoded = encodeBase64(bytes);
    expect(encoded).toBe('SGVsbG8gV29ybGQ=');
    expect(decodeBase64(encoded)).toEqual(bytes);
    expect(bytesToString(decodeBase64(encoded))).toBe(original);
  });

  test('Base64 works without runtime-specific globals', () => {
    const bytes = stringToBytes('Hello 🌍');
    expect(encodeBase64(bytes)).toBe('SGVsbG8g8J+MjQ==');
    expect(decodeBase64('SGVsbG8g8J+MjQ==')).toEqual(bytes);
  });

  test('Hex', () => {
    const original = 'Hello';
    const bytes = stringToBytes(original);
    const encoded = encodeHex(bytes);
    expect(encoded).toBe('48656c6c6f');
    expect(decodeHex(encoded)).toEqual(bytes);
    expect(bytesToString(decodeHex(encoded))).toBe(original);
  });

  test('Base64 URL', () => {
    const original = 'hello?world&foo=bar';
    const bytes = stringToBytes(original);
    const encoded = encodeBase64Url(bytes);
    expect(encoded).toBe('aGVsbG8_d29ybGQmZm9vPWJhcg==');
    expect(decodeBase64Url(encoded)).toEqual(bytes);

    const unpadded = encodeBase64Url(bytes, { pad: false });
    expect(unpadded).toBe('aGVsbG8_d29ybGQmZm9vPWJhcg');
    expect(decodeBase64Url(unpadded)).toEqual(bytes);
    expect(() => decodeBase64Url('+/')).toThrow(
      'Invalid Base64URL string: use only URL-safe characters.',
    );
  });

  test('stringToBytes and bytesToString', () => {
    const original = 'Hello World';
    const bytes = stringToBytes(original);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes).toEqual(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]),
    );
    expect(bytesToString(bytes)).toBe(original);

    const unicode = 'Hello 🌍';
    const unicodeBytes = stringToBytes(unicode);
    expect(bytesToString(unicodeBytes)).toBe(unicode);
  });
});
