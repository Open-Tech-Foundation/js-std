import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  clock,
  describe,
  expect,
  it,
  mock,
  test,
} from 'runtime:test';

import {
  bytesToString,
  decodeBase64,
  decodeBase64Url,
  decodeHex,
  encodeBase64,
  encodeBase64Url,
  encodeHex,
  isUtf8,
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

  test('isUtf8 accepts valid byte sequences and ArrayBuffers', () => {
    expect(isUtf8(stringToBytes('hello'))).toBe(true);
    expect(isUtf8(stringToBytes('ğ'))).toBe(true);
    expect(isUtf8(new Uint8Array())).toBe(true);
    expect(isUtf8(new Uint8Array([0xf0, 0x90, 0x80, 0x80]).buffer)).toBe(true);
  });

  test('isUtf8 rejects invalid byte sequences from Node.js isUtf8 tests', () => {
    // Cases from nodejs/node test/parallel/test-buffer-isutf8.js.
    const invalidInputs = [
      [0xff],
      [0xc0],
      [0xe0],
      [0xc0, 0x00],
      [0xc0, 0xc0],
      [0xe0, 0x00],
      [0xe0, 0xc0],
      [0xe0, 0x80, 0x00],
      [0xe0, 0x80, 0xc0],
      [0xfc, 0x80, 0x80, 0x80, 0x80, 0x80],
      [0xfe, 0x80, 0x80, 0x80, 0x80, 0x80],
      [0xc0, 0x80],
      [0xe0, 0x80, 0x80],
      [0xf0, 0x80, 0x80, 0x80],
      [0xf8, 0x80, 0x80, 0x80, 0x80],
      [0xfc, 0x80, 0x80, 0x80, 0x80, 0x80],
      [0xc1, 0xbf],
      [0xe0, 0x81, 0xbf],
      [0xf0, 0x80, 0x81, 0xbf],
      [0xf8, 0x80, 0x80, 0x81, 0xbf],
      [0xfc, 0x80, 0x80, 0x80, 0x81, 0xbf],
      [0xe0, 0x9f, 0xbf],
      [0xf0, 0x80, 0x9f, 0xbf],
      [0xf8, 0x80, 0x80, 0x9f, 0xbf],
      [0xfc, 0x80, 0x80, 0x80, 0x9f, 0xbf],
      [0xf0, 0x8f, 0xbf, 0xbf],
      [0xf8, 0x80, 0x8f, 0xbf, 0xbf],
      [0xfc, 0x80, 0x80, 0x8f, 0xbf, 0xbf],
      [0xf8, 0x84, 0x8f, 0xbf, 0xbf],
      [0xfc, 0x80, 0x84, 0x8f, 0xbf, 0xbf],
      [0xed, 0xa0, 0x80],
      [0xed, 0xb0, 0x80],
      [0xed, 0xa0, 0x80, 0xed, 0xb0, 0x80],
      [0xf4, 0x90, 0x80, 0x80],
    ];

    for (const input of invalidInputs) {
      expect(isUtf8(new Uint8Array(input))).toBe(false);
    }
  });

  test('isUtf8 treats detached ArrayBuffers and views as empty', () => {
    const buffer = new ArrayBuffer(1);
    new Uint8Array(buffer)[0] = 0xff;
    const view = new Uint8Array(buffer);

    expect(isUtf8(buffer)).toBe(false);
    expect(isUtf8(view)).toBe(false);

    structuredClone(buffer, { transfer: [buffer] });

    expect(isUtf8(buffer)).toBe(true);
    expect(isUtf8(view)).toBe(true);
  });

  test('isUtf8 rejects non-buffer inputs with TypeError', () => {
    const invalidInputs = [
      null,
      undefined,
      'hello',
      true,
      false,
      123,
      {},
      [],
      new Uint16Array([1]),
    ];

    for (const input of invalidInputs) {
      expect(() => isUtf8(input as never)).toThrow(TypeError);
    }
  });
});
