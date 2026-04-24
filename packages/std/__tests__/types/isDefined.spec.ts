import { isDefined } from '../../src';

describe('Types > isDefined', () => {
  test('invalid cases', () => {
    expect(isDefined()).toBe(false);
    expect(isDefined(undefined)).toBe(false);
    expect(isDefined(void 0)).toBe(false);
  });

  test('valid cases', () => {
    expect(isDefined(null)).toBe(true);
    expect(isDefined(0)).toBe(true);
    expect(isDefined(1)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined([])).toBe(true);
    expect(isDefined({})).toBe(true);
    expect([1, undefined, 2].filter(isDefined)).toEqual([1, 2]);
  });
});
