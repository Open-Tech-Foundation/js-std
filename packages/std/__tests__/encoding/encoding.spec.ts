import { base64Decode, base64Encode, hexDecode, hexEncode } from '../../src';

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
});
