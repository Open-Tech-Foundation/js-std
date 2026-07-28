import { hmacSHA256, stringToBytes, timingSafeEqual } from '../../src';

describe('timingSafeEqual', () => {
  test('compares equal strings', () => {
    expect(timingSafeEqual('', '')).toBe(true);
    expect(timingSafeEqual('a', 'a')).toBe(true);
    expect(timingSafeEqual('secret-token', 'secret-token')).toBe(true);
  });

  test('compares unequal strings of the same length', () => {
    expect(timingSafeEqual('a', 'b')).toBe(false);
    expect(timingSafeEqual('abc', 'abd')).toBe(false);
    // Differs only in the first byte.
    expect(timingSafeEqual('xbc', 'abc')).toBe(false);
  });

  test('compares strings of different lengths', () => {
    expect(timingSafeEqual('abc', 'abcd')).toBe(false);
    expect(timingSafeEqual('abcd', 'abc')).toBe(false);
    expect(timingSafeEqual('', 'a')).toBe(false);
    expect(timingSafeEqual('a', '')).toBe(false);
  });

  test('compares strings by their UTF-8 bytes', () => {
    expect(timingSafeEqual('héllo', 'héllo')).toBe(true);
    expect(timingSafeEqual('🔐', '🔐')).toBe(true);
    expect(timingSafeEqual('🔐', '🔓')).toBe(false);
    // 'é' is two UTF-8 bytes, so these differ in length as bytes.
    expect(timingSafeEqual('é', 'e')).toBe(false);
  });

  test('compares Uint8Arrays', () => {
    expect(
      timingSafeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3])),
    ).toBe(true);
    expect(
      timingSafeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4])),
    ).toBe(false);
    expect(
      timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3])),
    ).toBe(false);
    expect(timingSafeEqual(new Uint8Array([]), new Uint8Array([]))).toBe(true);
  });

  test('compares ArrayBuffers', () => {
    const a = new Uint8Array([9, 8, 7]);
    const b = new Uint8Array([9, 8, 7]);
    const c = new Uint8Array([9, 8, 6]);

    expect(timingSafeEqual(a.buffer, b.buffer)).toBe(true);
    expect(timingSafeEqual(a.buffer, c.buffer)).toBe(false);
  });

  test('mixes strings and byte views', () => {
    expect(timingSafeEqual('abc', stringToBytes('abc'))).toBe(true);
    expect(timingSafeEqual(stringToBytes('abc'), 'abd')).toBe(false);
  });

  test('respects the byte offset of a view', () => {
    const buffer = new Uint8Array([0, 0, 1, 2, 3]).buffer;
    const view = new Uint8Array(buffer, 2, 3);

    expect(timingSafeEqual(view, new Uint8Array([1, 2, 3]))).toBe(true);
    // The whole buffer must not compare equal to the slice.
    expect(timingSafeEqual(buffer, new Uint8Array([1, 2, 3]))).toBe(false);
  });

  test('compares views of differing element sizes by their bytes', () => {
    const u16 = new Uint16Array([0x0201]);
    const dataView = new DataView(new Uint8Array([1, 2]).buffer);

    // Little-endian platforms lay 0x0201 out as [1, 2].
    const expected = new Uint8Array(u16.buffer);
    expect(timingSafeEqual(u16, expected)).toBe(true);
    expect(timingSafeEqual(dataView, new Uint8Array([1, 2]))).toBe(true);
  });

  test('rejects non-byte inputs', () => {
    expect(() => timingSafeEqual(42 as never, 'a')).toThrow(TypeError);
    expect(() => timingSafeEqual('a', null as never)).toThrow(TypeError);
    expect(() => timingSafeEqual('a', {} as never)).toThrow(TypeError);
  });

  test('verifies an HMAC digest', async () => {
    const digest = await hmacSHA256('secret', 'payload');
    const tampered = await hmacSHA256('secret', 'payload!');

    expect(timingSafeEqual(digest, digest)).toBe(true);
    expect(timingSafeEqual(digest, tampered)).toBe(false);
  });
});
