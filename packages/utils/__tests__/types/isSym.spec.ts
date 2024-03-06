import { isSym } from '../../src';

describe('Types > isSym', () => {
  test('invalid cases', () => {
    expect(isSym()).toBe(false);
    expect(isSym(null)).toBe(false);
    expect(isSym(1)).toBe(false);
    expect(isSym('abc')).toBe(false);
    expect(isSym(Symbol)).toBe(false);
  });

  test('valid cases', () => {
    expect(isSym(Symbol())).toBe(true);
    expect(isSym(Symbol('abc'))).toBe(true);
    expect(isSym(Symbol.iterator)).toBe(true);
  });
});
