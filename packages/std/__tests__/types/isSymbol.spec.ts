import { isSymbol } from '../../src';

describe('Types > isSymbol', () => {
  test('invalid cases', () => {
    expect(isSymbol()).toBe(false);
    expect(isSymbol(null)).toBe(false);
    expect(isSymbol(1)).toBe(false);
    expect(isSymbol('abc')).toBe(false);
    expect(isSymbol(Symbol)).toBe(false);
  });

  test('valid cases', () => {
    expect(isSymbol(Symbol())).toBe(true);
    expect(isSymbol(Symbol('abc'))).toBe(true);
    expect(isSymbol(Symbol.iterator)).toBe(true);
  });
});
