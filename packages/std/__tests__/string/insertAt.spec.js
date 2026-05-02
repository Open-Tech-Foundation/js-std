import { strInsertAt } from '../../src';

describe('String', () => {
  test('strInsertAt', () => {
    expect(() => strInsertAt()).toThrow();
    expect(strInsertAt('')).toBe('');
    expect(strInsertAt('', 0)).toBe('');
    expect(strInsertAt('', 1, 'abc')).toBe('abc');
    expect(strInsertAt('a', 0, 'b')).toBe('ba');
    expect(strInsertAt('a', 1, 'b')).toBe('ab');
    expect(strInsertAt('a', 1, 'bc')).toBe('abc');
    expect(strInsertAt('foo baz', 3, ' bar')).toBe('foo bar baz');
    expect(strInsertAt('I  🍊', 2, 'ate an')).toBe('I ate an 🍊');
    expect(strInsertAt('IU', 1, '❤️')).toBe('I❤️U');
  });
});
