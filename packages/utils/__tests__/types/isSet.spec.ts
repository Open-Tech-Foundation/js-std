import { isSet } from '../../src';

describe('Types > isSet', () => {
  test('invalid cases', () => {
    expect(isSet()).toBe(false);
    expect(isSet(null)).toBe(false);
    expect(isSet({})).toBe(false);
    expect(isSet([])).toBe(false);
    expect(isSet(Set)).toBe(false);
    expect(isSet(new WeakSet())).toBe(false);
  });

  test('valid cases', () => {
    expect(isSet(new Set())).toBe(true);
  });
});
