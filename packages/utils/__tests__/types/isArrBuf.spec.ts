import { isArrBuf } from '../../src';

describe('Types > isArrBuf', () => {
  test('invalid cases', () => {
    expect(isArrBuf()).toBe(false);
    expect(isArrBuf(null)).toBe(false);
    expect(isArrBuf([])).toBe(false);
    expect(isArrBuf(new Uint8Array())).toBe(false);
  });

  test('valid cases', () => {
    expect(isArrBuf(new ArrayBuffer(8))).toBe(true);
  });
});
