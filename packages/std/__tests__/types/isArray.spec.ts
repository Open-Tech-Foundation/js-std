import { isArray } from '../../src';

describe('Types > isArray', () => {
  test('invalid cases', () => {
    expect(isArray()).toBe(false);
    expect(isArray('[]')).toBe(false);
    expect(isArray('Array')).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray(new Uint8Array(32))).toBe(false);
  });

  test('valid cases', () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1])).toBe(true);
    expect(isArray([])).toBe(true);
    expect(isArray(['a', 'b', 'c'])).toBe(true);
    expect(isArray(new Array(3))).toBe(true);
  });
});
