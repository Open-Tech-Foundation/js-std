import { stringReplaceAt } from '../../src';

describe('String > stringReplaceAt', () => {
  test('stringReplaceAt', () => {
    expect(() => stringReplaceAt()).toThrow();
    expect(stringReplaceAt('')).toBe('');
    expect(stringReplaceAt('', 0)).toBe('');
    expect(stringReplaceAt('', 0, 'a')).toBe('a');
    expect(stringReplaceAt('', 1, 'abc')).toBe('abc');
    expect(stringReplaceAt('a')).toBe('');
    expect(stringReplaceAt('abc')).toBe('bc');
    expect(stringReplaceAt('abc', 1)).toBe('ac');
    expect(stringReplaceAt('abc', 5)).toBe('abc');
    expect(stringReplaceAt('abc', 1, '')).toBe('ac');
    expect(stringReplaceAt('abc', 0, 'z')).toBe('zbc');
    expect(stringReplaceAt('iphone', 1, 'P')).toBe('iPhone');
    expect(stringReplaceAt('I__JS', 1, '❤️')).toBe('I❤️JS');
    expect(stringReplaceAt('I HATE U', 2, 'LOVE')).toBe('I LOVE U');
  });
});
