import { isArrayBuffer } from '../../src';

describe('Types > isArrayBuffer', () => {
  test('invalid cases', () => {
    expect(isArrayBuffer()).toBe(false);
    expect(isArrayBuffer(null)).toBe(false);
    expect(isArrayBuffer([])).toBe(false);
    expect(isArrayBuffer(new Uint8Array())).toBe(false);
  });

  test('valid cases', () => {
    expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true);
  });
});
