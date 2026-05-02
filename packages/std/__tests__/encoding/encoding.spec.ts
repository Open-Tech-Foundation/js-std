import {
  base64Decode,
  base64Encode,
  base64UrlDecode,
  base64UrlEncode,
  bytesToString,
  hexDecode,
  hexEncode,
  stringToBytes,
} from '../../src';

describe('Encoding Utilities', () => {
  test('Base64', () => {
    const original = 'Hello World';
    const encoded = base64Encode(original);
    expect(encoded).toBe('SGVsbG8gV29ybGQ=');
    expect(base64Decode(encoded)).toBe(original);
  });

  test('Hex', () => {
    const original = 'Hello';
    const encoded = hexEncode(original);
    expect(encoded).toBe('48656c6c6f');
    expect(hexDecode(encoded)).toBe(original);
  });

  test('Base64 URL', () => {
    const original = 'hello?world&foo=bar';
    const encoded = base64UrlEncode(original);
    expect(encoded).toBe('aGVsbG8_d29ybGQmZm9vPWJhcg==');
    expect(base64UrlDecode(encoded)).toBe(original);

    const unpaded = base64UrlEncode(original, { pad: false });
    expect(unpaded).toBe('aGVsbG8_d29ybGQmZm9vPWJhcg');
    expect(base64UrlDecode(unpaded)).toBe(original);
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
