import { isTypedArray } from '../../src';

describe('Types > isTypedArray', () => {
  test('invalid cases', () => {
    expect(isTypedArray()).toBe(false);
    expect(isTypedArray(null)).toBe(false);
    expect(isTypedArray([])).toBe(false);
    expect(isTypedArray([])).toBe(false);
    expect(isTypedArray({})).toBe(false);
  });

  test('valid cases', () => {
    expect(isTypedArray(new Uint8Array())).toBe(true);
    expect(isTypedArray(new Float32Array())).toBe(true);
    expect(isTypedArray(new Int8Array())).toBe(true);
    expect(isTypedArray(new Uint8ClampedArray())).toBe(true);
  });
});
