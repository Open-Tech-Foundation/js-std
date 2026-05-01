import {
  hmacSHA256,
  hmacSHA512,
  randomBytes,
  randomFloat,
  randomId,
  randomInt,
  randomString,
  sha256,
  sha512,
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

  test('randomFloat', () => {
    const val = randomFloat(0, 1);
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThan(1);
    expect(typeof val).toBe('number');
    expect(randomFloat(1, 5)).toBeGreaterThanOrEqual(1);
    expect(randomFloat(1, 5)).toBeLessThan(5);
    expect(() => randomFloat(5, 1)).toThrow();
    expect(() => randomFloat(1, 1)).toThrow();
  });

  test('sha256', async () => {
    expect(await sha256('hello')).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
    expect(await sha256('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
    expect((await sha256('hello')).length).toBe(64);
  });

  test('sha512', async () => {
    expect(await sha512('hello')).toBe(
      '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
    );
    expect(await sha512('')).toBe(
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
    );
    expect((await sha512('hello')).length).toBe(128);
  });

  test('hmacSHA256', async () => {
    expect(await hmacSHA256('key', 'message')).toBe(
      '6e9ef29b75fffc5b7abae527d58fdadb2fe42e7219011976917343065f58ed4a',
    );
    expect((await hmacSHA256('key', 'message')).length).toBe(64);
    // Different key produces different hash
    expect(await hmacSHA256('other', 'message')).not.toBe(
      await hmacSHA256('key', 'message'),
    );
  });

  test('hmacSHA512', async () => {
    expect(await hmacSHA512('key', 'message')).toBe(
      'e477384d7ca229dd1426e64b63ebf2d36ebd6d7e669a6735424e72ea6c01d3f8b56eb39c36d8232f5427999b8d1a3f9cd1128fc69f4d75b434216810fa367e98',
    );
    expect((await hmacSHA512('key', 'message')).length).toBe(128);
    // Different key produces different hash
    expect(await hmacSHA512('other', 'message')).not.toBe(
      await hmacSHA512('key', 'message'),
    );
  });
});
