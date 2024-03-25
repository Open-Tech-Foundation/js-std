import { isDef } from '../../src';

describe('Types > isDef', () => {
  test('invalid cases', () => {
    expect(isDef()).toBe(false);
    expect(isDef(undefined)).toBe(false);
    expect(isDef(void 0)).toBe(false);
  });

  test('valid cases', () => {
    expect(isDef(null)).toBe(true);
    expect(isDef(0)).toBe(true);
    expect(isDef(1)).toBe(true);
    expect(isDef('')).toBe(true);
    expect(isDef([])).toBe(true);
    expect(isDef({})).toBe(true);
    expect([1, undefined, 2].filter(isDef)).toEqual([1, 2]);
  });
});
