import { isWkSet } from '../../src';

describe('Types > isWkSet', () => {
  test('invalid cases', () => {
    expect(isWkSet()).toBe(false);
    expect(isWkSet(null)).toBe(false);
    expect(isWkSet(new Set())).toBe(false);
  });

  test('valid cases', () => {
    expect(isWkSet(new WeakSet())).toBe(true);
  });
});
