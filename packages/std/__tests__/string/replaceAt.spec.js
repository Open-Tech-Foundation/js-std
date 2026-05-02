import { strReplaceAt } from '../../src';

describe('String', () => {
  test('strReplaceAt', () => {
    expect(() => strReplaceAt()).toThrow();
    expect(strReplaceAt('')).toBe('');
    expect(strReplaceAt('', 0)).toBe('');
    expect(strReplaceAt('', 0, 'a')).toBe('a');
    expect(strReplaceAt('', 1, 'abc')).toBe('abc');
    expect(strReplaceAt('a')).toBe('');
    expect(strReplaceAt('abc')).toBe('bc');
    expect(strReplaceAt('abc', 1)).toBe('ac');
    expect(strReplaceAt('abc', 5)).toBe('abc');
    expect(strReplaceAt('abc', 1, '')).toBe('ac');
    expect(strReplaceAt('abc', 0, 'z')).toBe('zbc');
    expect(strReplaceAt('iphone', 1, 'P')).toBe('iPhone');
    expect(strReplaceAt('I__JS', 1, '❤️')).toBe('I❤️JS');
    expect(strReplaceAt('I HATE U', 2, 'LOVE')).toBe('I LOVE U');
  });
});
