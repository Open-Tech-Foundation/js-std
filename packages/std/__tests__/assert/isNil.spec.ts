import { isNil } from '../../src';

describe('Assert => isNil', () => {
  test('falsy', () => {
    expect(isNil('')).toBe(false);
    expect(isNil([])).toBe(false);
    expect(isNil({})).toBe(false);
  });

  test('truthy', () => {
    expect(isNil()).toBe(true);
    expect(isNil(undefined)).toBe(true);
    expect(isNil(null)).toBe(true);
    expect([1, null, 2, undefined, 3].filter((i) => !isNil(i))).toEqual([
      1, 2, 3,
    ]);
  });
});
