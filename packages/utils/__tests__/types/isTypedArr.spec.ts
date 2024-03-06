import { isTypedArr } from '../../src';

describe('Types > isTypedArr', () => {
  test('invalid cases', () => {
    expect(isTypedArr()).toBe(false);
    expect(isTypedArr(null)).toBe(false);
    expect(isTypedArr([])).toBe(false);
    expect(isTypedArr([])).toBe(false);
    expect(isTypedArr({})).toBe(false);
  });

  test('valid cases', () => {
    expect(isTypedArr(new Uint8Array())).toBe(true);
    expect(isTypedArr(new Float32Array())).toBe(true);
    expect(isTypedArr(new Int8Array())).toBe(true);
    expect(isTypedArr(new Uint8ClampedArray())).toBe(true);
  });
});
