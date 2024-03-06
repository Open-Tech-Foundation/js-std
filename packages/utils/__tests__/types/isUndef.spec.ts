import { isUndef } from '../../src';

describe('Types > isUndef', () => {
  test('invalid cases', () => {
    expect(isUndef(null)).toBe(false);
  });

  test('valid cases', () => {
    expect(isUndef()).toBe(true);
    expect(isUndef(undefined)).toBe(true);
    expect(isUndef(void 0)).toBe(true);
  });
});
