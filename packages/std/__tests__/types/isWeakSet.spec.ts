import { isWeakSet } from '../../src';

describe('Types > isWeakSet', () => {
  test('invalid cases', () => {
    expect(isWeakSet()).toBe(false);
    expect(isWeakSet(null)).toBe(false);
    expect(isWeakSet(new Set())).toBe(false);
  });

  test('valid cases', () => {
    expect(isWeakSet(new WeakSet())).toBe(true);
  });
});
