import { replaceAt } from '../../src';

describe('String', () => {
  test('replaceAt', () => {
    expect(() => replaceAt()).toThrow();
    expect(replaceAt('')).toBe('');
    expect(replaceAt('', 0)).toBe('');
    expect(replaceAt('', 0, 'a')).toBe('a');
    expect(replaceAt('', 1, 'abc')).toBe('abc');
    expect(replaceAt('a')).toBe('');
    expect(replaceAt('abc')).toBe('bc');
    expect(replaceAt('abc', 1)).toBe('ac');
    expect(replaceAt('abc', 5)).toBe('abc');
    expect(replaceAt('abc', 1, '')).toBe('ac');
    expect(replaceAt('abc', 0, 'z')).toBe('zbc');
    expect(replaceAt('iphone', 1, 'P')).toBe('iPhone');
    expect(replaceAt('I__JS', 1, '❤️')).toBe('I❤️JS');
    expect(replaceAt('I HATE U', 2, 'LOVE')).toBe('I LOVE U');
  });
});
