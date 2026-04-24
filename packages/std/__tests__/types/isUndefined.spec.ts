import { isUndefined } from '../../src';

describe('Types > isUndefined', () => {
  test('invalid cases', () => {
    expect(isUndefined(null)).toBe(false);
  });

  test('valid cases', () => {
    expect(isUndefined()).toBe(true);
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(void 0)).toBe(true);
  });
});
